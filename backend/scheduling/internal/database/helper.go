package database

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"reflect"
	"strings"

	"github.com/jmoiron/sqlx"

	"github.com/maksmelnyk/scheduling/internal/apperrors"
)

func FetchMultiple[T any](ctx context.Context, db *sqlx.DB, query string, args ...any) ([]*T, error) {
	var results []*T
	err := db.SelectContext(ctx, &results, query, args...)
	if err != nil {
		return nil, apperrors.NewInternal(err)
	}
	return results, nil
}

func FetchSingle[T any](ctx context.Context, db *sqlx.DB, query string, args ...any) (*T, error) {
	var result T
	err := db.GetContext(ctx, &result, query, args...)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperrors.NewNotFound(getTypeName(result)+" not found", apperrors.ErrResourceNotFound, err)
		}
		return nil, apperrors.NewInternal(err)
	}
	return &result, nil
}

func ExecNamedQuery(ctx context.Context, db *sqlx.DB, query string, arg any) error {
	_, err := db.NamedExecContext(ctx, query, arg)
	if err != nil {
		return apperrors.NewInternal(err)
	}
	return nil
}

func ExecNamedQueryWithResult[T any](ctx context.Context, db *sqlx.DB, query string, arg any) (T, error) {
	stmt, err := db.PrepareNamedContext(ctx, query)
	if err != nil {
		var zero T
		return zero, apperrors.NewInternal(err)
	}

	var result T
	err = stmt.GetContext(ctx, &result, arg)
	if err != nil {
		var zero T
		return zero, apperrors.NewInternal(err)
	}

	return result, nil
}

func ExecQuery(ctx context.Context, db *sqlx.DB, query string, args ...any) error {
	_, err := db.ExecContext(ctx, query, args...)
	if err != nil {
		return apperrors.NewInternal(err)
	}
	return nil
}

// ExecInsertMany inserts multiple rows into a table using a single query.
func ExecInsertMany(ctx context.Context, db *sqlx.DB, table string, items []any, skipColumns ...string) error {
	if len(items) == 0 {
		return nil
	}

	columns, err := GetDBColumns(items[0], skipColumns...)
	if err != nil {
		return apperrors.NewInternal(err)
	}

	query, err := BuildInsertQuery(table, columns, len(items), db)
	if err != nil {
		return apperrors.NewInternal(err)
	}

	args, err := FlattenValues(items, columns)
	if err != nil {
		return apperrors.NewInternal(err)
	}

	_, err = db.ExecContext(ctx, query, args...)
	if err != nil {
		return apperrors.NewInternal(err)
	}
	return nil
}

func CheckExists(ctx context.Context, db *sqlx.DB, query string, args ...any) (bool, error) {
	var exists bool
	err := db.GetContext(ctx, &exists, query, args...)
	if err != nil {
		return false, apperrors.NewInternal(err)
	}
	return exists, nil
}

// GetDBColumns returns db column names from a struct, skipping specified fields (by db tag).
func GetDBColumns(obj any, skip ...string) ([]string, error) {
	v := reflect.ValueOf(obj)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}
	if v.Kind() != reflect.Struct {
		return nil, errors.New("sqlutil: expected struct input")
	}

	skipMap := make(map[string]struct{}, len(skip))
	for _, s := range skip {
		skipMap[s] = struct{}{}
	}

	var columns []string
	t := v.Type()
	for i := range t.NumField() {
		field := t.Field(i)
		dbTag := field.Tag.Get("db")
		if dbTag == "-" || dbTag == "" {
			continue
		}
		if _, skip := skipMap[dbTag]; skip {
			continue
		}
		columns = append(columns, dbTag)
	}
	return columns, nil
}

// BuildInsertQuery builds a parametrized insert query with the correct number of value placeholders.
func BuildInsertQuery(table string, columns []string, rowCount int, db *sqlx.DB) (string, error) {
	if rowCount == 0 {
		return "", errors.New("sqlutil: row count must be greater than zero")
	}
	if len(columns) == 0 {
		return "", errors.New("sqlutil: no columns provided")
	}

	base := fmt.Sprintf("INSERT INTO %s (%s) VALUES ", table, strings.Join(columns, ", "))
	single := "(" + strings.TrimRight(strings.Repeat("?, ", len(columns)), ", ") + ")"

	values := make([]string, rowCount)
	for i := range values {
		values[i] = single
	}

	query := base + strings.Join(values, ", ")
	return db.Rebind(query), nil
}

// FlattenValues extracts values from structs in the order of given column names.
func FlattenValues(objs []any, columns []string) ([]any, error) {
	var args []any
	for _, obj := range objs {
		v := reflect.Indirect(reflect.ValueOf(obj))
		if v.Kind() != reflect.Struct {
			return nil, errors.New("sqlutil: expected struct in values")
		}

		for _, col := range columns {
			found := false
			for i := 0; i < v.NumField(); i++ {
				field := v.Type().Field(i)
				dbTag := field.Tag.Get("db")
				if dbTag == col {
					args = append(args, v.Field(i).Interface())
					found = true
					break
				}
			}
			if !found {
				return nil, fmt.Errorf("sqlutil: column %s not found in struct", col)
			}
		}
	}
	return args, nil
}

func getTypeName[T any](result T) string {
	var typeName string
	typ := reflect.TypeOf(result)
	if typ.Kind() == reflect.Ptr {
		typeName = typ.Elem().Name()
	} else {
		typeName = typ.Name()
	}
	return typeName
}
