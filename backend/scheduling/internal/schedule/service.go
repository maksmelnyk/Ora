package schedule

import (
	"context"
	"errors"
	"math"
	"time"

	"github.com/google/uuid"

	"slices"

	"github.com/maksmelnyk/scheduling/internal/apperrors"
	"github.com/maksmelnyk/scheduling/internal/auth"
	e "github.com/maksmelnyk/scheduling/internal/database/entities"
	"github.com/maksmelnyk/scheduling/internal/logger"
	"github.com/maksmelnyk/scheduling/internal/messaging"
	"github.com/maksmelnyk/scheduling/internal/products"
)

type ScheduleRepository interface {
	GetWorkingPeriods(ctx context.Context, userId uuid.UUID, fromDate, toDate time.Time) ([]*e.WorkingPeriod, error)
	GetScheduledEvents(ctx context.Context, workingPeriodIds []int64) ([]*e.ScheduledEvent, error)
	GetBookings(ctx context.Context, workingPeriodIds []int64) ([]*e.Booking, error)
	GetWorkingPeriodById(ctx context.Context, userId uuid.UUID, id int64) (*e.WorkingPeriod, error)
	GetScheduledEventById(ctx context.Context, userId uuid.UUID, id int64) (*e.ScheduledEvent, error)
	GetScheduledEventLessonIds(ctx context.Context, productId int64) ([]int64, error)
	ProductScheduledEventExists(ctx context.Context, id int64, productId int64) (bool, error)
	HasLinkedEvents(ctx context.Context, workingPeriodId int64) (bool, error)
	AddWorkingPeriod(ctx context.Context, wd *e.WorkingPeriod) error
	UpdateWorkingPeriod(ctx context.Context, wd *e.WorkingPeriod) error
	AddScheduledEvent(ctx context.Context, se *e.ScheduledEvent) error
	DeleteWorkingPeriod(ctx context.Context, userId uuid.UUID, id int64) error
	DeleteScheduledEvent(ctx context.Context, userId uuid.UUID, id int64) error
}

type ScheduleService struct {
	log       logger.Logger
	repo      ScheduleRepository
	client    *products.ProductServiceClient
	publisher *messaging.Publisher
}

func NewScheduleService(
	log logger.Logger,
	repo ScheduleRepository,
	client *products.ProductServiceClient,
	publisher *messaging.Publisher,
) *ScheduleService {
	return &ScheduleService{log: log, repo: repo, client: client, publisher: publisher}
}

func (s *ScheduleService) GetScheduleByUserId(ctx context.Context, userId uuid.UUID, fromDate time.Time, toDate time.Time) (*ScheduleResponse, error) {
	log := logger.FromContext(ctx, s.log)

	workingPeriods, err := s.repo.GetWorkingPeriods(ctx, userId, fromDate, toDate)
	if err != nil {
		log.Error("failed to get working periods", err)
		return nil, err
	}

	if len(workingPeriods) == 0 {
		return &ScheduleResponse{}, nil
	}

	var workingPeriodIds []int64
	for _, wp := range workingPeriods {
		workingPeriodIds = append(workingPeriodIds, wp.Id)
	}

	scheduledEvents, err := s.repo.GetScheduledEvents(ctx, workingPeriodIds)
	if err != nil {
		log.Error("failed to get scheduled events", err)
		return nil, err
	}

	bookings, err := s.repo.GetBookings(ctx, workingPeriodIds)
	if err != nil {
		log.Error("failed to get bookings", err)
		return nil, err
	}

	schedule := &ScheduleResponse{
		WorkingPeriods:  MapWorkingPeriodsToResponse(workingPeriods),
		ScheduledEvents: MapScheduledEventsToResponse(scheduledEvents),
		Bookings:        MapBookingsToResponse(bookings),
	}

	return schedule, nil
}

func (s *ScheduleService) GetScheduledEventMetadata(ctx context.Context, request *ScheduledEventMetadataRequest) (*ScheduledEventMetadataResponse, error) {
	log := logger.FromContext(ctx, s.log)

	if (request.LessonIds == nil || slices.Contains(request.LessonIds, 0)) && request.ScheduledEventId == nil {
		msg := "either lessonIds or scheduledEventId must be provided"
		log.Error(msg)
		return &ScheduledEventMetadataResponse{ErrorMessage: msg}, nil
	}

	if request.ScheduledEventId != nil {
		exists, err := s.repo.ProductScheduledEventExists(ctx, *request.ScheduledEventId, request.ProductId)
		if err != nil {
			msg := "failed to check if scheduled event exists"
			log.Error(msg, err)
			return &ScheduledEventMetadataResponse{ErrorMessage: msg}, err
		}

		if !exists {
			msg := "scheduled event does not exist"
			log.Error(msg)
			return &ScheduledEventMetadataResponse{ErrorMessage: msg}, nil
		}
	}

	if request.LessonIds != nil {
		lessonIds, err := s.repo.GetScheduledEventLessonIds(ctx, request.ProductId)
		if err != nil {
			msg := "failed to get scheduled event lesson ids"
			log.Error(msg, err)
			return &ScheduledEventMetadataResponse{ErrorMessage: msg}, err
		}

		for _, lessonId := range request.LessonIds {
			if !slices.Contains(lessonIds, lessonId) {
				msg := "lesson does not exist"
				log.Error("lesson does not exist")
				return &ScheduledEventMetadataResponse{ErrorMessage: msg}, nil
			}
		}
	}

	return &ScheduledEventMetadataResponse{IsValid: true}, nil
}

func (s *ScheduleService) AddWorkingPeriod(ctx context.Context, request *WorkingPeriodRequest) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		return apperrors.NewUnauthorized("Unauthorized user", err)
	}

	workingPeriods, err := s.repo.GetWorkingPeriods(ctx, userId, request.StartTime, request.EndTime)
	if err != nil {
		log.Error("failed to get working periods", err)
		return err
	}

	for _, wp := range workingPeriods {
		if request.StartTime.Before(wp.EndTime) && request.EndTime.After(wp.StartTime) {
			log.Error("working period overlaps with existing working period")
			return apperrors.NewUnprocessedEntity("Working period overlaps with existing working period", apperrors.ErrWorkingPeriodHours)
		}
	}

	err = s.repo.AddWorkingPeriod(ctx, MapRequestToWorkingPeriod(userId, request))
	if err != nil {
		log.Error("failed to add working period", err)
		return err
	}

	return nil
}

func (s *ScheduleService) UpdateWorkingPeriod(ctx context.Context, id int64, request *WorkingPeriodRequest) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		return apperrors.NewUnauthorized("Unauthorized user", err)
	}

	workingPeriod, err := s.repo.GetWorkingPeriodById(ctx, userId, id)
	if err != nil {
		log.Error("failed to get working period by id", err)
		return err
	}

	hasEvent, err := s.repo.HasLinkedEvents(ctx, id)
	if err != nil {
		log.Error("failed to check if booking exists", err)
		return err
	}

	if hasEvent {
		log.Error("cannot update working period with linked events")
		return apperrors.NewConflict("Cannot update working period with linked events", apperrors.ErrWorkingPeriodHasEvents)
	}

	MapRequestWithWorkingPeriod(request, workingPeriod)

	err = s.repo.UpdateWorkingPeriod(ctx, workingPeriod)
	if err != nil {
		log.Error("failed to update working period", err)
		return err
	}

	return nil
}

func (s *ScheduleService) DeleteWorkingPeriod(ctx context.Context, id int64) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		return apperrors.NewUnauthorized("Unauthorized user", err)
	}

	hasEvent, err := s.repo.HasLinkedEvents(ctx, id)
	if err != nil {
		log.Error("failed to check if booking exists", err)
		return err
	}

	if hasEvent {
		log.Error("cannot update working period with linked events")
		return apperrors.NewConflict("Cannot update working period with linked events", apperrors.ErrWorkingPeriodHasEvents)
	}

	err = s.repo.DeleteWorkingPeriod(ctx, userId, id)
	if err != nil {
		log.Error("failed to delete working period", err)
		return err
	}

	return nil
}

func (s *ScheduleService) AddScheduledEvent(
	ctx context.Context,
	workingPeriodId int64,
	request *ScheduledEventRequest,
	authHeader string,
) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		return apperrors.NewUnauthorized("Unauthorized user", err)
	}

	workingPeriod, err := s.repo.GetWorkingPeriodById(ctx, userId, workingPeriodId)
	if err != nil {
		log.Error("failed to get working period by id", err)
		return err
	}

	if request.StartTime.Before(workingPeriod.StartTime) || request.EndTime.After(workingPeriod.EndTime) {
		log.Error("scheduled event outside working hours")
		return apperrors.NewUnprocessedEntity("Scheduled event outside working hours", apperrors.ErrScheduledEventHours)
	}

	bookings, err := s.repo.GetBookings(ctx, []int64{workingPeriodId})
	if err != nil {
		return err
	}

	for _, booking := range bookings {
		if request.StartTime.Before(booking.EndTime) && request.EndTime.After(booking.StartTime) {
			log.Errorf("scheduled event overlaps with a booking")
			return apperrors.NewUnprocessedEntity("Scheduled event overlaps with a booking", apperrors.ErrScheduledEventHours)
		}
	}

	durationMin := int(math.Round(request.EndTime.Sub(request.StartTime).Minutes()))
	pi, err := s.client.GetSchedulingMetadata(ctx, request.ProductId, request.LessonId, durationMin, authHeader)
	if err != nil {
		return err
	}

	if pi.State == products.Invalid {
		return errors.New(pi.ErrorMessage)
	}

	if pi.State == products.Unschedulable {
		return errors.New("product is unschedulable")
	}

	err = s.repo.AddScheduledEvent(ctx, MapRequestToScheduledEvent(request, userId, workingPeriodId, pi.Title, pi.MaxParticipants))
	if err != nil {
		log.Error("failed to add scheduled event", err)
		return err
	}

	s.publisher.Publish(
		ctx,
		messaging.EventScheduledKey,
		messaging.NewEventScheduledEvent(
			request.ProductId,
			request.StartTime.Format(time.RFC3339),
			request.EndTime.Format(time.RFC3339),
		),
	)

	return nil
}

func (s *ScheduleService) DeleteScheduledEvent(ctx context.Context, id int64) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		return apperrors.NewUnauthorized("Unauthorized user", err)
	}

	_, err = s.repo.GetScheduledEventById(ctx, userId, id)
	if err != nil {
		log.Error("failed to get scheduled event by id", err)
		return err
	}

	err = s.repo.DeleteScheduledEvent(ctx, userId, id)
	if err != nil {
		log.Error("failed to delete scheduled event", err)
		return err
	}

	return nil
}
