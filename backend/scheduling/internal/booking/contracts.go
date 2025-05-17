package booking

import (
	"time"

	"github.com/maksmelnyk/scheduling/internal/apperrors"
)

// swagger:model BookingRequest
type BookingRequest struct {
	EnrollmentId    int64
	WorkingPeriodId int64
	StartTime       time.Time
	EndTime         time.Time
}

func (b *BookingRequest) Validate() error {
	var errors []apperrors.ValidationErrorDetail

	if b.EnrollmentId <= 0 {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "EnrollmentId",
			Message: "must be greater than zero",
		})
	}

	if b.WorkingPeriodId <= 0 {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "WorkingPeriodId",
			Message: "must be greater than zero",
		})
	}

	if b.StartTime.IsZero() {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "StartTime",
			Message: "must not be empty",
		})
	}

	if b.EndTime.IsZero() {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "EndTime",
			Message: "must not be empty",
		})
	}

	if !b.StartTime.IsZero() && !b.EndTime.IsZero() {
		if b.StartTime.After(b.EndTime) {
			errors = append(errors, apperrors.ValidationErrorDetail{
				Field:   "StartTime",
				Message: "must be before EndTime",
			})
		}
	}

	if len(errors) > 0 {
		return apperrors.NewValidation("Booking request data failed validation", apperrors.ErrValidationFailed, errors)
	}

	return nil
}
