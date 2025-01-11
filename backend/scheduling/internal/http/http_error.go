package http

import (
	"errors"
	"net/http"

	ec "github.com/maksmelnyk/scheduling/internal/errors"
)

// RestError Rest error struct
type RestError struct {
	Status     int
	ErrCode    string
	ErrMessage string
}

// NewBadRequestError New Bad Request Error
func NewBadRequestError(code string, msg string) *RestError {
	return &RestError{
		Status:     http.StatusBadRequest,
		ErrCode:    code,
		ErrMessage: msg,
	}
}

// NewNotFoundError New Not Found Error
func NewNotFoundError(code string, msg string) *RestError {
	return &RestError{
		Status:     http.StatusNotFound,
		ErrCode:    code,
		ErrMessage: msg,
	}
}

// NewUnauthorizedError New Unauthorized Error
func NewUnauthorizedError(code string, msg string) *RestError {
	return &RestError{
		Status:     http.StatusUnauthorized,
		ErrCode:    code,
		ErrMessage: msg,
	}
}

// NewForbiddenError New Forbidden Error
func NewForbiddenError(code string, msg string) *RestError {
	return &RestError{
		Status:     http.StatusForbidden,
		ErrCode:    code,
		ErrMessage: msg,
	}
}

// NewInternalServerError New Internal Server Error
func NewInternalServerError() *RestError {
	return &RestError{
		Status:     http.StatusInternalServerError,
		ErrCode:    ec.ErrInternalError.Error(),
		ErrMessage: "Internal server error occurred. Please try again later",
	}
}

// ParseError Parse error based on error code
func ParseError(err error) *RestError {
	switch {
	case errors.Is(err, ec.ErrInvalidInputParameters):
		return NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Invalid input parameters")
	case errors.Is(err, ec.ErrUserIdNotFound):
		return NewUnauthorizedError(ec.ErrUserIdNotFound.Error(), "User ID not found in context")
	case errors.Is(err, ec.ErrBookingConflict):
		return NewBadRequestError(ec.ErrBookingConflict.Error(), "Working period conflicts with existing booking")
	case errors.Is(err, ec.ErrBookingNotFound):
		return NewNotFoundError(ec.ErrBookingNotFound.Error(), "Booking not found")
	case errors.Is(err, ec.ErrBookingStatusInvalid):
		return NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Invalid booking status")
	case errors.Is(err, ec.ErrScheduleEventNotFound):
		return NewNotFoundError(ec.ErrScheduleEventNotFound.Error(), "Schedule event not found")
	case errors.Is(err, ec.ErrScheduleEventOutsideWorkingHours):
		return NewBadRequestError(ec.ErrScheduleEventOutsideWorkingHours.Error(), "Schedule event outside working hours")
	case errors.Is(err, ec.ErrScheduleEventOverlapBooking):
		return NewBadRequestError(ec.ErrScheduleEventOverlapBooking.Error(), "Schedule event overlaps with existing booking")
	case errors.Is(err, ec.ErrWorkingPeriodNotFound):
		return NewNotFoundError(ec.ErrWorkingPeriodNotFound.Error(), "Working period not found")
	case errors.Is(err, ec.ErrWorkingPeriodOverlap):
		return NewNotFoundError(ec.ErrWorkingPeriodNotFound.Error(), "Working periods overlap")
	case errors.Is(err, ec.ErrInternalError):
		return NewInternalServerError()
	default:
		return NewInternalServerError()
	}
}
