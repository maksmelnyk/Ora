package schedule

import (
	"time"

	"github.com/google/uuid"
	"github.com/maksmelnyk/scheduling/internal/validation"
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
	if s.ProductId <= 0 {
		return validation.NewValidationError("SessionId", "must be greater than 0")
	}
	if s.WorkingPeriodId <= 0 {
		return validation.NewValidationError("SessionId", "must be greater than 0")
	}
	if s.StartTime.After(s.EndTime) {
		return validation.NewValidationError("StartTime", "must be before EndTime")
	}
	return nil
}

func (w *WorkingPeriodRequest) Validate() error {
	if w.StartTime.Before(time.Now().Truncate(24 * time.Hour)) {
		return validation.NewValidationError("Date", "must not be in the past")
	}
	if w.StartTime.After(w.EndTime) {
		return validation.NewValidationError("StartTime", "must be before EndTime")
	}
	return nil
}
