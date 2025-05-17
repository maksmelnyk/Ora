package booking

import (
	"time"

	"github.com/google/uuid"

	"github.com/maksmelnyk/scheduling/internal/database/entities"
)

func MapRequestToBooking(
	b *BookingRequest,
	studentId uuid.UUID,
	educatorId uuid.UUID,
	productId int64,
	title string,
) *entities.Booking {
	return &entities.Booking{
		StudentId:       studentId,
		EducatorId:      educatorId,
		ProductId:       productId,
		Title:           title,
		EnrollmentId:    &b.EnrollmentId,
		WorkingPeriodId: b.WorkingPeriodId,
		StartTime:       b.StartTime,
		EndTime:         b.EndTime,
		Status:          entities.Pending,
		CreatedAt:       time.Now().UTC(),
		UpdatedAt:       time.Now().UTC(),
	}
}

func MapScheduledEventToBooking(e *entities.ScheduledEvent, studentId uuid.UUID) *entities.Booking {
	return &entities.Booking{
		StudentId:        studentId,
		EducatorId:       e.UserId,
		ProductId:        e.ProductId,
		Title:            e.Title,
		ScheduledEventId: &e.Id,
		WorkingPeriodId:  e.WorkingPeriodId,
		StartTime:        e.StartTime,
		EndTime:          e.EndTime,
		Status:           entities.Approved,
		CreatedAt:        time.Now().UTC(),
		UpdatedAt:        time.Now().UTC(),
	}
}

func MapScheduledEventsToBookings(e []*entities.ScheduledEvent, studentId uuid.UUID) []*entities.Booking {
	if len(e) == 0 {
		return []*entities.Booking{}
	}

	response := make([]*entities.Booking, len(e))
	for i, b := range e {
		response[i] = MapScheduledEventToBooking(b, studentId)
	}
	return response
}
