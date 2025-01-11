package schedule

import (
	"time"

	"github.com/google/uuid"

	en "github.com/maksmelnyk/scheduling/internal/database/entities"
	con "github.com/maksmelnyk/scheduling/internal/schedule/contracts"
)

func MapWorkingPeriodToResponse(wp *en.WorkingPeriod) *con.WorkingPeriodResponse {
	return &con.WorkingPeriodResponse{
		Id:        wp.Id,
		Date:      wp.Date,
		StartTime: wp.StartTime,
		EndTime:   wp.EndTime,
	}
}

func MapWorkingPeriodsToResponse(wps []*en.WorkingPeriod) []*con.WorkingPeriodResponse {
	response := make([]*con.WorkingPeriodResponse, len(wps))
	for i, wd := range wps {
		response[i] = MapWorkingPeriodToResponse(wd)
	}
	return response
}

func MapRequestToWorkingPeriod(userId uuid.UUID, wpr *con.WorkingPeriodRequest) *en.WorkingPeriod {
	return &en.WorkingPeriod{
		UserId:    userId,
		Date:      wpr.Date,
		StartTime: wpr.StartTime,
		EndTime:   wpr.EndTime,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}
}

func MapRequestWithWorkingPeriod(wpr *con.WorkingPeriodRequest, wp *en.WorkingPeriod) {
	wp.StartTime = wpr.StartTime
	wp.EndTime = wpr.EndTime
	wp.UpdatedAt = time.Now().UTC()
}

func MapScheduledEventToResponse(se *en.ScheduledEvent) *con.ScheduledEventResponse {
	return &con.ScheduledEventResponse{
		Id:              se.Id,
		SessionId:       se.SessionId,
		WorkingPeriodId: se.WorkingPeriodId,
		StartTime:       se.StartTime,
		EndTime:         se.EndTime,
		MaxParticipants: se.MaxParticipants,
	}
}

func MapScheduledEventsToResponse(ses []*en.ScheduledEvent) []*con.ScheduledEventResponse {
	response := make([]*con.ScheduledEventResponse, len(ses))
	for i, se := range ses {
		response[i] = MapScheduledEventToResponse(se)
	}
	return response
}

func MapRequestToScheduledEvent(ser *con.ScheduledEventRequest, userId uuid.UUID, workingPeriodId int64) *en.ScheduledEvent {
	return &en.ScheduledEvent{
		SessionId:       ser.SessionId,
		WorkingPeriodId: workingPeriodId,
		UserId:          userId,
		StartTime:       ser.StartTime,
		EndTime:         ser.EndTime,
		MaxParticipants: ser.MaxParticipants,
		CreatedAt:       time.Now().UTC(),
		UpdatedAt:       time.Now().UTC(),
	}
}

func MapBookingToResponse(b *en.Booking) *con.BookingResponse {
	return &con.BookingResponse{
		Id:               b.Id,
		WorkingPeriodId:  b.WorkingPeriodId,
		SessionId:        b.SessionId,
		ScheduledEventId: b.ScheduledEventId,
		StudentId:        b.StudentId,
		StartTime:        b.StartTime,
		EndTime:          b.EndTime,
		Status:           b.Status,
	}
}

func MapBookingsToResponse(bs []*en.Booking) []*con.BookingResponse {
	response := make([]*con.BookingResponse, len(bs))
	for i, b := range bs {
		response[i] = MapBookingToResponse(b)
	}
	return response
}
