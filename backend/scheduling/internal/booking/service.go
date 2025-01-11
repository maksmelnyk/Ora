package booking

import (
	"context"
	"errors"

	"github.com/google/uuid"

	e "github.com/maksmelnyk/scheduling/internal/database/entities"
	ec "github.com/maksmelnyk/scheduling/internal/errors"
	log "github.com/maksmelnyk/scheduling/internal/logger"
	mid "github.com/maksmelnyk/scheduling/internal/middleware"
)

type BookingRepository interface {
	GetTeacherBookingById(ctx context.Context, teacherId uuid.UUID, id int64) (*e.Booking, error)
	GetWorkingPeriodById(ctx context.Context, userId uuid.UUID, id int64) (*e.WorkingPeriod, error)
	GetScheduledEvents(ctx context.Context, workingPeriodId int64) ([]*e.ScheduledEvent, error)
	AddBooking(ctx context.Context, b *e.Booking) error
	SetBookingStatus(ctx context.Context, id int64, teacherId uuid.UUID, status int) error
}

type BookingService struct {
	repo BookingRepository
}

func NewBookingService(repo BookingRepository) *BookingService {
	return &BookingService{repo: repo}
}

func (s *BookingService) AddBooking(ctx context.Context, request *BookingRequest) error {
	userId, ok := ctx.Value(mid.UserIdKey).(uuid.UUID)
	if !ok {
		log.Error("User ID not found in context")
		return ec.ErrUserIdNotFound
	}

	workingPeriod, err := s.repo.GetWorkingPeriodById(ctx, request.TeacherId, request.WorkingPeriodId)
	if err != nil {
		return err
	}

	if !workingPeriod.StartTime.Before(request.StartTime) || !workingPeriod.EndTime.After(request.EndTime) {
		log.Error("booking outside working hours")
		return ec.ErrScheduleEventOutsideWorkingHours
	}

	if err := s.validateBookingOverlap(ctx, request); err != nil {
		return err
	}

	booking := MapRequestToBooking(request, userId)
	if request.ScheduledEventId != nil {
		booking.Status = int(e.Approved)
	}

	if err := s.repo.AddBooking(ctx, booking); err != nil {
		log.Error("Failed to add booking", err)
		return ec.ErrInternalError
	}

	return nil
}

func (s *BookingService) UpdateBookingStatus(ctx context.Context, id int64, status int) error {
	userId, ok := ctx.Value(mid.UserIdKey).(uuid.UUID)
	if !ok {
		log.Error("User ID not found in context")
		return ec.ErrUserIdNotFound
	}

	if status != int(e.Approved) && status != int(e.Rejected) {
		return ec.ErrBookingStatusInvalid
	}

	booking, err := s.repo.GetTeacherBookingById(ctx, userId, id)
	if err != nil {
		log.Error("Failed to retrieve booking", err)
		return handleRepoError(err)
	}

	if booking.Status != int(e.Pending) {
		log.Errorf("Booking status already updated: %d", booking.Status)
		return ec.ErrBookingStatusUpdateRestricted
	}

	if err := s.repo.SetBookingStatus(ctx, id, userId, status); err != nil {
		log.Error("Failed to update booking status", err)
		return ec.ErrInternalError
	}

	return nil
}

func (s *BookingService) validateBookingOverlap(ctx context.Context, request *BookingRequest) error {
	scheduledEvents, err := s.repo.GetScheduledEvents(ctx, request.WorkingPeriodId)
	if err != nil {
		return err
	}

	for _, event := range scheduledEvents {
		if event.SessionId != request.SessionId && request.StartTime.Before(event.EndTime) && request.EndTime.After(event.StartTime) {
			log.Errorf("Booking overlaps with scheduled event: %d", event.Id)
			return ec.ErrScheduleEventOverlapBooking
		}
	}

	sessionEvent := selectEventBySessionId(scheduledEvents, request.SessionId)
	if request.ScheduledEventId != nil && (sessionEvent == nil || sessionEvent.Id != *request.ScheduledEventId) {
		log.Error("Scheduled event not found for provided ID")
		return ec.ErrScheduleEventNotFound
	}

	if request.ScheduledEventId == nil && sessionEvent != nil {
		return ec.ErrScheduleEventOverlapBooking
	}

	return nil
}

func selectEventBySessionId(events []*e.ScheduledEvent, sessionId int64) *e.ScheduledEvent {
	for _, event := range events {
		if event.SessionId == sessionId {
			return event
		}
	}
	return nil
}

func handleRepoError(err error) error {
	if errors.Is(err, ec.ErrBookingNotFound) {
		return err
	}
	return ec.ErrInternalError
}
