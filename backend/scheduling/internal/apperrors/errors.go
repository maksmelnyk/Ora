package apperrors

import (
	"fmt"
	"strings"
)

type baseError struct {
	Message string `json:"message"`
	Code    string `json:"code"`
	Err     error  `json:"-"`
}

func (b *baseError) Error() string {
	return b.Err.Error()
}

func (b *baseError) Unwrap() error {
	return b.Err
}

func wrapError(msg string, code string, errs ...error) baseError {
	bErr := baseError{Message: msg, Code: code}
	if len(errs) > 0 && errs[0] != nil {
		bErr.Err = fmt.Errorf("%s (code: %s): %s: %w", strings.ReplaceAll(code, "ERROR_", ""), code, msg, errs[0])
	} else {
		bErr.Err = fmt.Errorf("%s (code: %s): %s", strings.ReplaceAll(code, "ERROR_", ""), code, msg)
	}
	return bErr
}

// --- UnauthorizedError ---
type UnauthorizedError struct {
	baseError
}

func NewUnauthorized(msg string, err ...error) *UnauthorizedError {
	return &UnauthorizedError{baseError: wrapError(msg, ErrUnauthorized, err...)}
}

// --- ForbiddenError ---
type ForbiddenError struct {
	baseError
}

func NewForbidden(msg string, err ...error) *ForbiddenError {
	return &ForbiddenError{baseError: wrapError(msg, ErrForbidden, err...)}
}

// --- NotFoundError ---
type NotFoundError struct {
	baseError
}

func NewNotFound(msg, code string, err ...error) *NotFoundError {
	return &NotFoundError{baseError: wrapError(msg, code, err...)}
}

// --- BadRequestError ---
type BadRequestError struct {
	baseError
}

func NewBadRequestError(msg, code string, err ...error) *BadRequestError {
	return &BadRequestError{baseError: wrapError(msg, code, err...)}
}

// --- ConflictError ---
type ConflictError struct {
	baseError
}

func NewConflict(msg, code string, err ...error) *ConflictError {
	return &ConflictError{baseError: wrapError(msg, code, err...)}
}

// --- UnprocessedEntityError ---
type UnprocessedEntityError struct {
	baseError
}

func NewUnprocessedEntity(msg, code string, err ...error) *UnprocessedEntityError {
	return &UnprocessedEntityError{baseError: wrapError(msg, code, err...)}
}

// --- ValidationError ---
type ValidationErrorDetail struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type ValidationError struct {
	baseError
	Details []ValidationErrorDetail `json:"details,omitempty"`
}

func NewValidation(msg, code string, details []ValidationErrorDetail, err ...error) *ValidationError {
	valErr := &ValidationError{
		baseError: wrapError(msg, code, err...),
		Details:   details,
	}

	if len(details) > 0 {
		var detailsStr []string
		for _, d := range details {
			detailsStr = append(detailsStr, fmt.Sprintf("%s: %s", d.Field, d.Message))
		}
		valErr.baseError.Err = fmt.Errorf("%w; Details: [%s]", valErr.baseError.Err, strings.Join(detailsStr, "; "))
	}

	return valErr
}

// --- InternalError ---
type InternalError struct {
	baseError
}

func NewInternal(err ...error) *InternalError {
	return &InternalError{baseError: wrapError("Internal Server Error", ErrInternalError, err...)}
}
