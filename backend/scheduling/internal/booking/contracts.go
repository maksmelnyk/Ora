package booking

import (
	"time"

	"github.com/maksmelnyk/scheduling/internal/validation"
)

// swagger:model BookingRequest
type BookingRequest struct {
	EnrollmentId    int64
	WorkingPeriodId int64
	StartTime       time.Time
	EndTime         time.Time
}

func (b *BookingRequest) Validate() error {
	if b.EnrollmentId == 0 {
		return validation.NewValidationError("EnrollmentId", "must not be zero")
	}
	if b.StartTime.IsZero() || b.EndTime.IsZero() {
		return validation.NewValidationError("StartTime/EndTime", "must not be empty")
	}
	if b.StartTime.After(b.EndTime) {
		return validation.NewValidationError("StartTime", "must be before EndTime")
	}
	return nil
}
