package api

import (
	"encoding/json"
	"net/http"

	"github.com/maksmelnyk/scheduling/internal/apperrors"
)

// WriteError writes an error response to the http.ResponseWriter
func WriteError(w http.ResponseWriter, err error) {
	var status int
	var payload any

	switch e := err.(type) {
	case *apperrors.UnauthorizedError:
		status = http.StatusUnauthorized
		payload = e
	case *apperrors.ForbiddenError:
		status = http.StatusForbidden
		payload = e
	case *apperrors.NotFoundError:
		status = http.StatusNotFound
		payload = e
	case *apperrors.BadRequestError:
		status = http.StatusBadRequest
		payload = e
	case *apperrors.ConflictError:
		status = http.StatusConflict
		payload = e
	case *apperrors.UnprocessedEntityError:
		status = http.StatusUnprocessableEntity
		payload = e
	case *apperrors.ValidationError:
		status = http.StatusUnprocessableEntity
		payload = e
	case *apperrors.InternalError:
		status = http.StatusInternalServerError
		payload = map[string]string{
			"code":    apperrors.ErrInternalError,
			"message": "An unexpected error occurred.",
		}
	default:
		status = http.StatusInternalServerError
		payload = map[string]string{
			"code":    apperrors.ErrInternalError,
			"message": "An unexpected error occurred.",
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err = json.NewEncoder(w).Encode(payload)
	if err != nil {
		return
	}
}

// WriteJson writes a JSON response with the given status code and data
func WriteJson(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(payload)
	if err != nil {
		return
	}
}
