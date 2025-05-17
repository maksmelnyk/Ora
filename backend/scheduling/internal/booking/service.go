package booking

import (
	"context"
	"errors"
	"fmt"
	"math"
	"time"

	"github.com/google/uuid"

	"github.com/maksmelnyk/scheduling/internal/apperrors"
	"github.com/maksmelnyk/scheduling/internal/auth"
	"github.com/maksmelnyk/scheduling/internal/database/entities"
	"github.com/maksmelnyk/scheduling/internal/logger"
	"github.com/maksmelnyk/scheduling/internal/messaging"
	"github.com/maksmelnyk/scheduling/internal/products"
	"github.com/maksmelnyk/scheduling/internal/schedule"
)

type BookingRepository interface {
	GetEducatorBookingById(ctx context.Context, educatorId uuid.UUID, id int64) (*entities.Booking, error)
	GetBookingsByUserId(ctx context.Context, userId uuid.UUID, upcomingAfter *time.Time, skip int, take int) ([]*entities.Booking, error)
	GetWorkingPeriodById(ctx context.Context, userId uuid.UUID, id int64) (*entities.WorkingPeriod, error)
	GetWorkingPeriodBookings(ctx context.Context, workingPeriodId int64) ([]*entities.Booking, error)
	GetWorkingPeriodScheduledEvents(ctx context.Context, workingPeriodId int64) ([]*entities.ScheduledEvent, error)
	GetLessonsScheduledEvents(ctx context.Context, lessonIds []int64) ([]*entities.ScheduledEvent, error)
	GetScheduledEventById(ctx context.Context, id int64) (*entities.ScheduledEvent, error)
	HasBookingByEnrollmentId(ctx context.Context, enrollmentId int64) (bool, error)
	AddBooking(ctx context.Context, booking *entities.Booking) error
	AddBookings(ctx context.Context, booking []*entities.Booking) error
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
		return nil, apperrors.NewUnauthorized("Unauthorized user", err)
	}

	var upcomingAfter *time.Time
	if upcomingOnly {
		now := time.Now().UTC()
		upcomingAfter = &now
	}

	bookings, err := s.repo.GetBookingsByUserId(ctx, userId, upcomingAfter, skip, take)
	if err != nil {
		log.Error("failed to get bookings", err)
		return nil, err
	}

	return schedule.MapBookingsToResponse(bookings), nil
}

func (s *BookingService) AddBooking(ctx context.Context, request *BookingRequest, authHeader string) error {
	log := logger.FromContext(ctx, s.log)

	userId, err := auth.GetUserID(ctx)
	if err != nil {
		return apperrors.NewUnauthorized("Unauthorized user", err)
	}

	hasBooking, err := s.repo.HasBookingByEnrollmentId(ctx, request.EnrollmentId)
	if err != nil {
		log.Error("Failed to check existing booking", err)
		return err
	}

	if hasBooking {
		log.Error("Booking already exists for this enrollment")
		return apperrors.NewConflict("Booking already exists for this enrollment", apperrors.ErrBookingAlreadyExists)
	}

	durationMin := int(math.Round(request.EndTime.Sub(request.StartTime).Minutes()))
	metadata, err := s.client.GetBookingMetadata(ctx, request.EnrollmentId, durationMin, authHeader)
	if err != nil {
		log.Error("Failed to get booking metadata", err)
		return err
	}

	if !metadata.IsValid {
		log.Error(metadata.ErrorMessage)
		return errors.New("invalid booking metadata")
	}

	educatorId, err := uuid.Parse(metadata.EducatorId)
	if err != nil {
		log.Error("Failed to parse educator ID", err)
		return err
	}

	workingPeriod, err := s.repo.GetWorkingPeriodById(ctx, educatorId, request.WorkingPeriodId)
	if err != nil {
		log.Error("Failed to retrieve working period", err)
		return err
	}

	if !((request.StartTime.Equal(workingPeriod.StartTime) || request.StartTime.After(workingPeriod.StartTime)) &&
		(request.EndTime.Equal(workingPeriod.EndTime) || request.EndTime.Before(workingPeriod.EndTime))) {

		log.Error("booking outside specified working period")
		return apperrors.NewUnprocessedEntity("Booking outside specified working period", apperrors.ErrBookingHours)
	}

	bookings, err := s.repo.GetWorkingPeriodBookings(ctx, request.WorkingPeriodId)
	if err != nil {
		log.Error("Failed to retrieve bookings", err)
		return err
	}

	for _, booking := range bookings {
		if request.StartTime.Before(booking.EndTime) && request.EndTime.After(booking.StartTime) {
			log.Errorf("Booking overlaps with existing booking: %d", booking.Id)
			return apperrors.NewUnprocessedEntity("Booking overlaps with existing booking", apperrors.ErrBookingHours)
		}
	}

	scheduledEvents, err := s.repo.GetWorkingPeriodScheduledEvents(ctx, request.WorkingPeriodId)
	if err != nil {
		log.Error("Failed to retrieve scheduled events", err)
		return err
	}

	for _, event := range scheduledEvents {
		if request.StartTime.Before(event.EndTime) && request.EndTime.After(event.StartTime) {
			log.Errorf("Booking overlaps with scheduled event: %d", event.Id)
			return apperrors.NewUnprocessedEntity("Booking overlaps with scheduled event", apperrors.ErrBookingHours)
		}
	}

	booking := MapRequestToBooking(request, userId, educatorId, *metadata.ProductId, metadata.Title)

	if err := s.repo.AddBooking(ctx, booking); err != nil {
		log.Error("Failed to add booking", err)
		return err
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
		return apperrors.NewUnauthorized("Unauthorized user", err)
	}

	if status != int(entities.Approved) && status != int(entities.Cancelled) {
		log.Error("Invalid booking status: " + fmt.Sprintf("%d", status))
		return apperrors.NewBadRequestError("Invalid booking status", apperrors.ErrParameterInvalid)
	}

	booking, err := s.repo.GetEducatorBookingById(ctx, userId, id)
	if err != nil {
		log.Error("Failed to retrieve booking", err)
		return err
	}

	if booking.Status != entities.Pending {
		log.Errorf("Booking status already updated: %d", booking.Status)
		return apperrors.NewUnprocessedEntity("Booking completed", apperrors.ErrBookingStatus)
	}

	if err := s.repo.SetBookingStatus(ctx, id, userId, status); err != nil {
		log.Error("Failed to update booking status", err)
		return err
	}

	if status == int(entities.Approved) {
		s.publisher.Publish(
			ctx,
			messaging.BookingCompletedKey,
			messaging.NewBookingCompletedEvent(booking.StudentId.String(), *booking.EnrollmentId),
		)
	}

	return nil
}
