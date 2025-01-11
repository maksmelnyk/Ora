package booking

import (
	"time"

	"github.com/google/uuid"

	en "github.com/maksmelnyk/scheduling/internal/database/entities"
)

func MapRequestToBooking(b *BookingRequest, studentId uuid.UUID) *en.Booking {
	return &en.Booking{
		StudentId:        studentId,
		TeacherId:        b.TeacherId,
		SessionId:        b.SessionId,
		ScheduledEventId: b.ScheduledEventId,
		WorkingPeriodId:  b.WorkingPeriodId,
		StartTime:        b.StartTime,
		EndTime:          b.EndTime,
		Status:           int(en.Pending),
		CreatedAt:        time.Now().UTC(),
		UpdatedAt:        time.Now().UTC(),
	}
}
