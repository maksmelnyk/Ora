package schedule

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

	e "github.com/maksmelnyk/scheduling/internal/database/entities"
	ec "github.com/maksmelnyk/scheduling/internal/errors"
	"github.com/maksmelnyk/scheduling/internal/logger"
	mid "github.com/maksmelnyk/scheduling/internal/middleware"
	con "github.com/maksmelnyk/scheduling/internal/schedule/contracts"
)

type ScheduleRepository interface {
	GetWorkingPeriods(ctx context.Context, userId uuid.UUID, fromDate, toDate time.Time) ([]*e.WorkingPeriod, error)
	GetScheduledEvents(ctx context.Context, workingPeriodIds []int64) ([]*e.ScheduledEvent, error)
	GetBookings(ctx context.Context, workingPeriodIds []int64) ([]*e.Booking, error)
	GetWorkingPeriodById(ctx context.Context, userId uuid.UUID, id int64) (*e.WorkingPeriod, error)
	GetScheduledEventById(ctx context.Context, userId uuid.UUID, id int64) (*e.ScheduledEvent, error)
	HasLinkedEvents(ctx context.Context, workingPeriodId int64) (bool, error)
	AddWorkingPeriod(ctx context.Context, wd *e.WorkingPeriod) error
	UpdateWorkingPeriod(ctx context.Context, wd *e.WorkingPeriod) error
	AddScheduledEvent(ctx context.Context, se *e.ScheduledEvent) error
	DeleteWorkingPeriod(ctx context.Context, userId uuid.UUID, id int64) error
	DeleteScheduledEvent(ctx context.Context, userId uuid.UUID, id int64) error
}

type ScheduleService struct {
	log  logger.Logger
	repo ScheduleRepository
}

func NewScheduleService(log logger.Logger, repo ScheduleRepository) *ScheduleService {
	return &ScheduleService{log: log, repo: repo}
}

func (s *ScheduleService) GetUserSchedule(ctx context.Context, userId uuid.UUID, fromDate time.Time, toDate time.Time) (*con.ScheduleResponse, error) {
	log := logger.FromContext(ctx, s.log)

	workingPeriods, err := s.repo.GetWorkingPeriods(ctx, userId, fromDate, toDate)
	if err != nil {
		log.Error("failed to get working periods", err)
		return nil, ec.ErrInternalError
	}

	if len(workingPeriods) == 0 {
		return &con.ScheduleResponse{}, nil
	}

	var workingPeriodIds []int64
	for _, wp := range workingPeriods {
		workingPeriodIds = append(workingPeriodIds, wp.Id)
	}

	scheduledEvents, err := s.repo.GetScheduledEvents(ctx, workingPeriodIds)
	if err != nil {
		log.Error("failed to get scheduled events", err)
		return nil, ec.ErrInternalError
	}

	bookings, err := s.repo.GetBookings(ctx, workingPeriodIds)
	if err != nil {
		log.Error("failed to get bookings", err)
		return nil, ec.ErrInternalError
	}

	schedule := &con.ScheduleResponse{
		WorkingPeriods:  MapWorkingPeriodsToResponse(workingPeriods),
		ScheduledEvents: MapScheduledEventsToResponse(scheduledEvents),
		Bookings:        MapBookingsToResponse(bookings),
	}

	return schedule, nil
}

func (s *ScheduleService) AddWorkingPeriod(ctx context.Context, wpr *con.WorkingPeriodRequest) error {
	log := logger.FromContext(ctx, s.log)

	userId, ok := ctx.Value(mid.UserIdKey).(uuid.UUID)
	if !ok {
		return ec.ErrUserIdNotFound
	}

	workingPeriods, err := s.repo.GetWorkingPeriods(ctx, userId, wpr.Date, wpr.Date)
	if err != nil {
		log.Error("failed to get working periods", err)
		return ec.ErrInternalError
	}

	for _, wp := range workingPeriods {
		if wpr.StartTime.Before(wp.EndTime) && wpr.EndTime.After(wp.StartTime) {
			log.Error("scheduled event overlaps with a booking")
			return ec.ErrWorkingPeriodOverlap
		}
	}

	err = s.repo.AddWorkingPeriod(ctx, MapRequestToWorkingPeriod(userId, wpr))
	if err != nil {
		log.Error("failed to add working period", err)
		return ec.ErrInternalError
	}

	return nil
}

func (s *ScheduleService) UpdateWorkingPeriod(ctx context.Context, id int64, wpr *con.WorkingPeriodRequest) error {
	log := logger.FromContext(ctx, s.log)

	userId, ok := ctx.Value(mid.UserIdKey).(uuid.UUID)
	if !ok {
		return ec.ErrUserIdNotFound
	}

	workingPeriod, err := s.repo.GetWorkingPeriodById(ctx, userId, id)
	if err != nil {
		log.Error("failed to get working period by id", err)
		if errors.Is(err, ec.ErrWorkingPeriodNotFound) {
			return err
		}
		return ec.ErrInternalError
	}

	hasEvent, err := s.repo.HasLinkedEvents(ctx, id)
	if err != nil {
		log.Error("failed to check if booking exists", err)
		return ec.ErrInternalError
	}

	if hasEvent {
		log.Error("cannot update working period on a day with bookings")
		return ec.ErrBookingConflict
	}

	MapRequestWithWorkingPeriod(wpr, workingPeriod)

	err = s.repo.UpdateWorkingPeriod(ctx, workingPeriod)
	if err != nil {
		log.Error("failed to update working period", err)
		return ec.ErrInternalError
	}

	return nil
}

func (s *ScheduleService) DeleteWorkingPeriod(ctx context.Context, id int64) error {
	log := logger.FromContext(ctx, s.log)

	userId, ok := ctx.Value(mid.UserIdKey).(uuid.UUID)
	if !ok {
		return ec.ErrUserIdNotFound
	}

	hasEvent, err := s.repo.HasLinkedEvents(ctx, id)
	if err != nil {
		log.Error("failed to check if booking exists", err)
		return ec.ErrInternalError
	}

	if hasEvent {
		log.Error("cannot update working period on a day with bookings")
		return ec.ErrBookingConflict
	}

	err = s.repo.DeleteWorkingPeriod(ctx, userId, id)
	if err != nil {
		log.Error("failed to delete working period", err)
		return ec.ErrInternalError
	}

	return nil
}

func (s *ScheduleService) AddScheduledEvent(ctx context.Context, workingPeriodId int64, ser *con.ScheduledEventRequest) error {
	log := logger.FromContext(ctx, s.log)

	userId, ok := ctx.Value(mid.UserIdKey).(uuid.UUID)
	if !ok {
		return ec.ErrUserIdNotFound
	}

	workingPeriod, err := s.repo.GetWorkingPeriodById(ctx, userId, workingPeriodId)
	if err != nil {
		log.Error("failed to get working period by id", err)
		if errors.Is(err, ec.ErrWorkingPeriodNotFound) {
			return err
		}
		return ec.ErrInternalError
	}

	if ser.StartTime.Before(workingPeriod.StartTime) || ser.EndTime.After(workingPeriod.EndTime) {
		log.Error("scheduled event outside working hours")
		return ec.ErrScheduleEventOutsideWorkingHours
	}

	bookings, err := s.repo.GetBookings(ctx, []int64{workingPeriodId})
	if err != nil {

		return err
	}

	for _, booking := range bookings {
		if ser.StartTime.Before(booking.EndTime) && ser.EndTime.After(booking.StartTime) {
			log.Errorf("scheduled event overlaps with a booking")
			return ec.ErrScheduleEventOverlapBooking
		}
	}

	err = s.repo.AddScheduledEvent(ctx, MapRequestToScheduledEvent(ser, userId, workingPeriodId))
	if err != nil {
		log.Error("failed to add scheduled event", err)
		return ec.ErrInternalError
	}

	return nil
}

func (s *ScheduleService) DeleteScheduledEvent(ctx context.Context, id int64) error {
	log := logger.FromContext(ctx, s.log)

	userId, ok := ctx.Value(mid.UserIdKey).(uuid.UUID)
	if !ok {
		return ec.ErrUserIdNotFound
	}

	_, err := s.repo.GetScheduledEventById(ctx, userId, id)
	if err != nil {
		log.Error("failed to get scheduled event by id", err)
		if errors.Is(err, ec.ErrScheduleEventNotFound) {
			return err
		}
		return ec.ErrInternalError
	}

	err = s.repo.DeleteScheduledEvent(ctx, userId, id)
	if err != nil {
		log.Error("failed to delete scheduled event", err)
		return ec.ErrInternalError
	}

	return nil
}
