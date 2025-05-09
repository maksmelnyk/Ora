package booking

import (
	"time"

	"github.com/google/uuid"

	en "github.com/maksmelnyk/scheduling/internal/database/entities"
)

func MapRequestToBooking(
	b *BookingRequest,
	studentId uuid.UUID,
	educatorId uuid.UUID,
	productId int64,
	title string,
) *en.Booking {
	return &en.Booking{
		StudentId:       studentId,
		EducatorId:      educatorId,
		ProductId:       productId,
		Title:           title,
		EnrollmentId:    &b.EnrollmentId,
		WorkingPeriodId: b.WorkingPeriodId,
		StartTime:       b.StartTime,
		EndTime:         b.EndTime,
		Status:          en.Pending,
		CreatedAt:       time.Now().UTC(),
		UpdatedAt:       time.Now().UTC(),
	}
}

func MapScheduledEventToBooking(e *en.ScheduledEvent, studentId uuid.UUID) *en.Booking {
	return &en.Booking{
		StudentId:        studentId,
		EducatorId:       e.UserId,
		ProductId:        e.ProductId,
		Title:            e.Title,
		ScheduledEventId: &e.Id,
		WorkingPeriodId:  e.WorkingPeriodId,
		StartTime:        e.StartTime,
		EndTime:          e.EndTime,
		Status:           en.Approved,
		CreatedAt:        time.Now().UTC(),
		UpdatedAt:        time.Now().UTC(),
	}
}

func MapScheduledEventsToBookings(e []*en.ScheduledEvent, studentId uuid.UUID) []*en.Booking {
	if len(e) == 0 {
		return []*en.Booking{}
	}

	response := make([]*en.Booking, len(e))
	for i, b := range e {
		response[i] = MapScheduledEventToBooking(b, studentId)
	}
	return response
}
