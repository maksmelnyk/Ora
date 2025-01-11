package database

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"

	ec "github.com/maksmelnyk/scheduling/internal/errors"
)

func FetchMultiple[T any](ctx context.Context, db *sqlx.DB, query string, args ...interface{}) ([]*T, error) {
	var results []*T
	err := db.SelectContext(ctx, &results, query, args...)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func FetchSingle[T any](ctx context.Context, db *sqlx.DB, query string, args ...interface{}) (*T, error) {
	var result T
	err := db.GetContext(ctx, &result, query, args...)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ec.ErrBookingNotFound
		}
		return nil, err
	}
	return &result, nil
}

func ExecNamedQuery(ctx context.Context, db *sqlx.DB, query string, arg interface{}) error {
	_, err := db.NamedExecContext(ctx, query, arg)
	if err != nil {
		return err
	}
	return nil
}

func ExecQuery(ctx context.Context, db *sqlx.DB, query string, args ...interface{}) error {
	_, err := db.ExecContext(ctx, query, args...)
	if err != nil {
		return err
	}
	return nil
}

func CheckExists(ctx context.Context, db *sqlx.DB, query string, args ...interface{}) (bool, error) {
	var exists bool
	err := db.GetContext(ctx, &exists, query, args...)
	if err != nil {
		return false, err
	}
	return exists, nil
}
