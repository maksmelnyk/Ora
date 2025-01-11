package validation

import "fmt"

type Validator interface {
	Validate() error
}

type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

func NewValidationError(field, message string) error {
	return &ValidationError{Field: field, Message: message}
}
