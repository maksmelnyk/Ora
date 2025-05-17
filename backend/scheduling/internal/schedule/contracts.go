package schedule

import (
	"time"

	"github.com/google/uuid"
	"github.com/maksmelnyk/scheduling/internal/apperrors"
)

// swagger:model ScheduleResponse
type ScheduleResponse struct {
	WorkingPeriods  []*WorkingPeriodResponse
	ScheduledEvents []*ScheduledEventResponse
	Bookings        []*BookingResponse
}

// swagger:model WorkingPeriodResponse
type WorkingPeriodResponse struct {
	Id        int64     `json:"id"`
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
}

// swagger:model ScheduledEventResponse
type ScheduledEventResponse struct {
	Id              int64     `json:"id"`
	ProductId       int64     `json:"productId"`
	LessonId        *int64    `json:"lessonId"`
	Title           string    `json:"title"`
	WorkingPeriodId int64     `json:"workingPeriodId"`
	StartTime       time.Time `json:"startTime"`
	EndTime         time.Time `json:"endTime"`
	MaxParticipants int       `json:"maxParticipants"`
}

// swagger:model BookingResponse
type BookingResponse struct {
	Id               int64     `json:"id"`
	EducatorId       uuid.UUID `json:"educatorId"`
	StudentId        uuid.UUID `json:"studentId"`
	ProductId        int64     `json:"productId"`
	EnrollmentId     *int64    `json:"enrollmentId"`
	ScheduledEventId *int64    `json:"scheduledEventId"`
	WorkingPeriodId  int64     `json:"workingPeriodId"`
	StartTime        time.Time `json:"startTime"`
	EndTime          time.Time `json:"endTime"`
	Status           int       `json:"status"`
}

// swagger:model ScheduledEventRequest
type ScheduledEventRequest struct {
	WorkingPeriodId int64     `json:"workingPeriodId"`
	ProductId       int64     `json:"productId"`
	LessonId        *int64    `json:"lessonId"`
	StartTime       time.Time `json:"startTime"`
	EndTime         time.Time `json:"endTime"`
}

// swagger:model WorkingPeriodRequest
type WorkingPeriodRequest struct {
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
}

// swagger:model ScheduledEventMetadataRequest
type ScheduledEventMetadataRequest struct {
	ProductId        int64   `json:"productId"`
	ScheduledEventId *int64  `json:"scheduledEventId"`
	LessonIds        []int64 `json:"lessonIds"`
}

// swagger:model ScheduledEventMetadataResponse
type ScheduledEventMetadataResponse struct {
	IsValid      bool   `json:"isValid"`
	ErrorMessage string `json:"errorMessage"`
}

func (s *ScheduledEventRequest) Validate() error {
	var errors []apperrors.ValidationErrorDetail

	if s.ProductId <= 0 {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "SessionId",
			Message: "must be greater than 0",
		})
	}
	if s.WorkingPeriodId <= 0 {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "WorkingPeriodId",
			Message: "must be greater than 0",
		})
	}

	if s.StartTime.IsZero() {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "StartTime",
			Message: "must not be empty",
		})
	}

	if s.EndTime.IsZero() {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "EndTime",
			Message: "must not be empty",
		})
	}

	if !s.StartTime.IsZero() && !s.EndTime.IsZero() {
		if s.StartTime.After(s.EndTime) {
			errors = append(errors, apperrors.ValidationErrorDetail{
				Field:   "StartTime",
				Message: "must be before EndTime",
			})
		}
	}

	if len(errors) > 0 {
		return apperrors.NewValidation("Scheduled event request data failed validation", apperrors.ErrValidationFailed, errors)
	}

	return nil
}

func (w *WorkingPeriodRequest) Validate() error {
	var errors []apperrors.ValidationErrorDetail

	if w.StartTime.Before(time.Now().Truncate(24 * time.Hour)) {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "StartTime",
			Message: "must not be in the past",
		})
	}

	if w.StartTime.IsZero() {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "StartTime",
			Message: "must not be empty",
		})
	}

	if w.EndTime.IsZero() {
		errors = append(errors, apperrors.ValidationErrorDetail{
			Field:   "EndTime",
			Message: "must not be empty",
		})
	}

	if !w.StartTime.IsZero() && !w.EndTime.IsZero() {
		if w.StartTime.After(w.EndTime) {
			errors = append(errors, apperrors.ValidationErrorDetail{
				Field:   "StartTime",
				Message: "must be before EndTime",
			})
		}
	}

	if len(errors) > 0 {
		return apperrors.NewValidation("Working period request data failed validation", apperrors.ErrValidationFailed, errors)
	}

	return nil
}
