package schedule

import (
	"time"

	"github.com/google/uuid"

	en "github.com/maksmelnyk/scheduling/internal/database/entities"
)

func MapWorkingPeriodToResponse(wp *en.WorkingPeriod) *WorkingPeriodResponse {
	return &WorkingPeriodResponse{
		Id:        wp.Id,
		StartTime: wp.StartTime,
		EndTime:   wp.EndTime,
	}
}

func MapWorkingPeriodsToResponse(wps []*en.WorkingPeriod) []*WorkingPeriodResponse {
	if len(wps) == 0 {
		return []*WorkingPeriodResponse{}
	}

	response := make([]*WorkingPeriodResponse, len(wps))
	for i, wd := range wps {
		response[i] = MapWorkingPeriodToResponse(wd)
	}
	return response
}

func MapRequestToWorkingPeriod(userId uuid.UUID, wpr *WorkingPeriodRequest) *en.WorkingPeriod {
	return &en.WorkingPeriod{
		UserId:    userId,
		StartTime: wpr.StartTime,
		EndTime:   wpr.EndTime,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}
}

func MapRequestWithWorkingPeriod(wpr *WorkingPeriodRequest, wp *en.WorkingPeriod) {
	wp.StartTime = wpr.StartTime
	wp.EndTime = wpr.EndTime
	wp.UpdatedAt = time.Now().UTC()
}

func MapScheduledEventToResponse(se *en.ScheduledEvent) *ScheduledEventResponse {
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

func MapScheduledEventsToResponse(ses []*en.ScheduledEvent) []*ScheduledEventResponse {
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
) *en.ScheduledEvent {
	return &en.ScheduledEvent{
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

func MapBookingToResponse(b *en.Booking) *BookingResponse {
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

func MapBookingsToResponse(bs []*en.Booking) []*BookingResponse {
	if len(bs) == 0 {
		return []*BookingResponse{}
	}

	response := make([]*BookingResponse, len(bs))
	for i, b := range bs {
		response[i] = MapBookingToResponse(b)
	}
	return response
}
