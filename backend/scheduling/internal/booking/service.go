package booking

import (
	"context"
	"errors"
	"math"
	"time"

	"github.com/google/uuid"

	"github.com/maksmelnyk/scheduling/internal/auth"
	e "github.com/maksmelnyk/scheduling/internal/database/entities"
	ec "github.com/maksmelnyk/scheduling/internal/errors"
	"github.com/maksmelnyk/scheduling/internal/logger"
	"github.com/maksmelnyk/scheduling/internal/messaging"
	"github.com/maksmelnyk/scheduling/internal/products"
	"github.com/maksmelnyk/scheduling/internal/schedule"
)

type BookingRepository interface {
	GetEducatorBookingById(ctx context.Context, educatorId uuid.UUID, id int64) (*e.Booking, error)
	GetBookingsByUserId(ctx context.Context, userId uuid.UUID, upcomingAfter *time.Time, skip int, take int) ([]*e.Booking, error)
	GetWorkingPeriodById(ctx context.Context, userId uuid.UUID, id int64) (*e.WorkingPeriod, error)
	GetScheduledEvents(ctx context.Context, workingPeriodId int64) ([]*e.ScheduledEvent, error)
	GetLessonsScheduledEvents(ctx context.Context, lessonIds []int64) ([]*e.ScheduledEvent, error)
	GetScheduledEventById(ctx context.Context, id int64) (*e.ScheduledEvent, error)
	HasBookingByEnrollmentId(ctx context.Context, enrollmentId int64) (bool, error)
	AddBooking(ctx context.Context, b *e.Booking) error
	AddBookings(ctx context.Context, b []*e.Booking) error
	SetBookingStatus(ctx context.Context, id int64, educatorId uuid.UUID, status int) error
}

type BookingService struct {
	log       logger.Logger
	repo      BookingRepository
	client    *products.ProductServiceClient
	publisher *messaging.Publisher
}

func NewBookingService(
	log logger.Logger,
	repo BookingRepository,
	client *products.ProductServiceClient,
	publisher *messaging.Publisher,
) *BookingService {
	return &BookingService{log: log, repo: repo, client: client, publisher: publisher}
}

func (s *BookingService) GetMyBookings(ctx context.Context, upcomingOnly bool, skip int, take int) ([]*schedule.BookingResponse, error) {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		log.Error("User ID not found in context")
		return nil, ec.ErrUserIdNotFound
	}

	var upcomingAfter *time.Time
	if upcomingOnly {
		now := time.Now().UTC()
		upcomingAfter = &now
	}

	bookings, err := s.repo.GetBookingsByUserId(ctx, userId, upcomingAfter, skip, take)
	if err != nil {
		log.Error("failed to get bookings", err)
		return nil, ec.ErrInternalError
	}

	return schedule.MapBookingsToResponse(bookings), nil
}

func (s *BookingService) AddBooking(ctx context.Context, request *BookingRequest, authHeader string) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		log.Error("User ID not found in context")
		return ec.ErrUserIdNotFound
	}

	hasBooking, err := s.repo.HasBookingByEnrollmentId(ctx, request.EnrollmentId)
	if err != nil {
		log.Error("Failed to check existing booking", err)
		return ec.ErrInternalError
	}

	if hasBooking {
		log.Error("Booking already exists for this enrollment")
		return ec.ErrBookingAlreadyExists
	}

	durationMin := int(math.Round(request.EndTime.Sub(request.StartTime).Minutes()))
	metadata, err := s.client.GetBookingMetadata(ctx, request.EnrollmentId, durationMin, authHeader)
	if err != nil {
		return err
	}

	if !metadata.IsValid {
		return errors.New(metadata.ErrorMessage)
	}

	educatorId, err := uuid.Parse(metadata.EducatorId)
	if err != nil {
		return err
	}

	workingPeriod, err := s.repo.GetWorkingPeriodById(ctx, educatorId, request.WorkingPeriodId)
	if err != nil {
		return err
	}

	if !workingPeriod.StartTime.Before(request.StartTime) || !workingPeriod.EndTime.After(request.EndTime) {
		log.Error("booking outside working hours")
		return ec.ErrScheduleEventOutsideWorkingHours
	}

	scheduledEvents, err := s.repo.GetScheduledEvents(ctx, request.WorkingPeriodId)
	if err != nil {
		return err
	}

	for _, event := range scheduledEvents {
		if event.ProductId != *metadata.ProductId && request.StartTime.Before(event.EndTime) && request.EndTime.After(event.StartTime) {
			log.Errorf("Booking overlaps with scheduled event: %d", event.Id)
			return ec.ErrScheduleEventOverlapBooking
		}
	}

	booking := MapRequestToBooking(request, userId, educatorId, *metadata.ProductId, metadata.Title)

	if err := s.repo.AddBooking(ctx, booking); err != nil {
		log.Error("Failed to add booking", err)
		return ec.ErrInternalError
	}

	return nil
}

func (s *BookingService) AddAutoBooking(ctx context.Context, request *messaging.BookingCreationRequestedEvent) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := uuid.Parse(request.UserId)
	if err != nil {
		log.Error("Failed to parse user ID", err)
		return err
	}

	if request.ScheduledEventId != nil {
		event, err := s.repo.GetScheduledEventById(ctx, *request.ScheduledEventId)
		if err != nil {
			log.Error("Failed to retrieve scheduled event", err)
			return err
		}

		err = s.repo.AddBooking(ctx, MapScheduledEventToBooking(event, userId))
		if err != nil {
			log.Error("Failed to add booking", err)
			return err
		}
	}

	if request.LessonIds != nil {
		events, err := s.repo.GetLessonsScheduledEvents(ctx, request.LessonIds)
		if err != nil {
			log.Error("Failed to retrieve scheduled events", err)
			return err
		}

		err = s.repo.AddBookings(ctx, MapScheduledEventsToBookings(events, userId))
		if err != nil {
			log.Error("Failed to add bookings", err)
			return err
		}
	}

	return nil
}

func (s *BookingService) UpdateBookingStatus(ctx context.Context, id int64, status int) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		log.Error("User ID not found in context")
		return ec.ErrUserIdNotFound
	}

	if status != int(e.Approved) && status != int(e.Cancelled) {
		return ec.ErrBookingStatusInvalid
	}

	booking, err := s.repo.GetEducatorBookingById(ctx, userId, id)
	if err != nil {
		log.Error("Failed to retrieve booking", err)
		if errors.Is(err, ec.ErrBookingNotFound) {
			return err
		}
		return ec.ErrInternalError
	}

	if booking.Status != e.Pending {
		log.Errorf("Booking status already updated: %d", booking.Status)
		return ec.ErrBookingStatusUpdateRestricted
	}

	if err := s.repo.SetBookingStatus(ctx, id, userId, status); err != nil {
		log.Error("Failed to update booking status", err)
		return ec.ErrInternalError
	}

	if status == int(e.Approved) {
		s.publisher.Publish(
			ctx,
			messaging.BookingCompletedKey,
			messaging.NewBookingCompletedEvent(booking.StudentId.String(), *booking.EnrollmentId),
		)
	}

	return nil
}
