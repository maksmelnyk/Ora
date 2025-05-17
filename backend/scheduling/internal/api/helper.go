package api

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func ParseUUIDParam(w http.ResponseWriter, r *http.Request, paramName string) (uuid.UUID, error) {
	idStr := chi.URLParam(r, paramName)
	if idStr == "" {
		return uuid.Nil, fmt.Errorf("missing or empty path parameter '%s', expected a valid UUID", paramName)
	}

	id, err := uuid.Parse(idStr)
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid format for path parameter '%s', expected a valid UUID, received: '%s'", paramName, idStr)
	}
	return id, nil
}

func ParseLongParam(w http.ResponseWriter, r *http.Request, paramName string) (int64, error) {
	intStr := chi.URLParam(r, paramName)
	if intStr == "" {
		return 0, fmt.Errorf("missing or empty path parameter '%s', expected an integer", paramName)
	}
	val, err := strconv.ParseInt(intStr, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid format for path parameter '%s', expected an integer, received: '%s'", paramName, intStr)
	}
	return val, nil
}

func ParseTimeQuery(w http.ResponseWriter, r *http.Request, queryName string, format string) (time.Time, error) {
	dateStr := r.URL.Query().Get(queryName)

	if dateStr == "" {
		return time.Time{}, fmt.Errorf("missing or empty query parameter '%s', expected a timestamp in format '%s'", queryName, format)
	}

	date, err := time.Parse(format, dateStr)
	if err != nil {
		return time.Time{}, fmt.Errorf("invalid format for query parameter '%s', expected a timestamp in format '%s', received: '%s'", queryName, format, dateStr)
	}
	return date, nil
}
