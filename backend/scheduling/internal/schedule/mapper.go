package schedule

import (
	"time"

	"github.com/google/uuid"

	"github.com/maksmelnyk/scheduling/internal/database/entities"
)

func MapWorkingPeriodToResponse(wp *entities.WorkingPeriod) *WorkingPeriodResponse {
	return &WorkingPeriodResponse{
		Id:        wp.Id,
		StartTime: wp.StartTime,
		EndTime:   wp.EndTime,
	}
}

func MapWorkingPeriodsToResponse(wps []*entities.WorkingPeriod) []*WorkingPeriodResponse {
	if len(wps) == 0 {
		return []*WorkingPeriodResponse{}
	}

	response := make([]*WorkingPeriodResponse, len(wps))
	for i, wd := range wps {
		response[i] = MapWorkingPeriodToResponse(wd)
	}
	return response
}

func MapRequestToWorkingPeriod(userId uuid.UUID, wpr *WorkingPeriodRequest) *entities.WorkingPeriod {
	return &entities.WorkingPeriod{
		UserId:    userId,
		StartTime: wpr.StartTime,
		EndTime:   wpr.EndTime,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}
}

func MapRequestWithWorkingPeriod(wpr *WorkingPeriodRequest, wp *entities.WorkingPeriod) {
	wp.StartTime = wpr.StartTime
	wp.EndTime = wpr.EndTime
	wp.UpdatedAt = time.Now().UTC()
}

func MapScheduledEventToResponse(se *entities.ScheduledEvent) *ScheduledEventResponse {
	return &ScheduledEventResponse{
		Id:              se.Id,
		ProductId:       se.ProductId,
		LessonId:        se.LessonId,
		Title:           se.Title,
		WorkingPeriodId: se.WorkingPeriodId,
		StartTime:       se.StartTime,
		EndTime:         se.EndTime,
		MaxParticipants: se.MaxParticipants,
	}
}

func MapScheduledEventsToResponse(ses []*entities.ScheduledEvent) []*ScheduledEventResponse {
	if len(ses) == 0 {
		return []*ScheduledEventResponse{}
	}

	response := make([]*ScheduledEventResponse, len(ses))
	for i, se := range ses {
		response[i] = MapScheduledEventToResponse(se)
	}
	return response
}

func MapRequestToScheduledEvent(
	ser *ScheduledEventRequest,
	userId uuid.UUID,
	workingPeriodId int64,
	title string,
	maxParticipants int,
) *entities.ScheduledEvent {
	return &entities.ScheduledEvent{
		ProductId:       ser.ProductId,
		LessonId:        ser.LessonId,
		WorkingPeriodId: workingPeriodId,
		UserId:          userId,
		Title:           title,
		MaxParticipants: maxParticipants,
		StartTime:       ser.StartTime,
		EndTime:         ser.EndTime,
		CreatedAt:       time.Now().UTC(),
		UpdatedAt:       time.Now().UTC(),
	}
}

func MapBookingToResponse(b *entities.Booking) *BookingResponse {
	return &BookingResponse{
		Id:               b.Id,
		EducatorId:       b.EducatorId,
		StudentId:        b.StudentId,
		EnrollmentId:     b.EnrollmentId,
		ProductId:        b.ProductId,
		ScheduledEventId: b.ScheduledEventId,
		WorkingPeriodId:  b.WorkingPeriodId,
		StartTime:        b.StartTime,
		EndTime:          b.EndTime,
		Status:           int(b.Status),
	}
}

func MapBookingsToResponse(bs []*entities.Booking) []*BookingResponse {
	if len(bs) == 0 {
		return []*BookingResponse{}
	}

	response := make([]*BookingResponse, len(bs))
	for i, b := range bs {
		response[i] = MapBookingToResponse(b)
	}
	return response
}
