package booking

import (
	"context"
	"errors"
	"math"

	"github.com/google/uuid"
	"github.com/maksmelnyk/scheduling/internal/apperrors"
	"github.com/maksmelnyk/scheduling/internal/products"
	"github.com/maksmelnyk/scheduling/internal/timeutils"
)

func (s *BookingService) ensureNoExistingBooking(ctx context.Context, enrollmentId int64) error {
	hasBooking, err := s.repo.HasBookingByEnrollmentId(ctx, enrollmentId)
	if err != nil {
		return err
	}

	if hasBooking {
		return apperrors.NewConflict("Booking already exists for this enrollment", apperrors.ErrBookingAlreadyExists)
	}
	return nil
}

func (s *BookingService) getBookingMetadata(ctx context.Context, request *BookingRequest, authHeader string) (*products.EnrollmentBookingMetadataResponse, error) {
	durationMin := int(math.Round(request.EndTime.Sub(request.StartTime).Minutes()))
	metadata, err := s.client.GetBookingMetadata(ctx, request.EnrollmentId, durationMin, authHeader)
	if err != nil {
		return nil, err
	}

	if !metadata.IsValid {
		return nil, errors.New(metadata.ErrorMessage)
	}
	return metadata, nil
}

func (s *BookingService) validateBookingTiming(ctx context.Context, educatorId uuid.UUID, request *BookingRequest) error {
	workingPeriod, err := s.repo.GetWorkingPeriodById(ctx, educatorId, request.WorkingPeriodId)
	if err != nil {
		return err
	}

	if !timeutils.IsWithinPeriod(request.StartTime, request.EndTime, workingPeriod.StartTime, workingPeriod.EndTime) {
		return apperrors.NewUnprocessedEntity("Booking outside specified working period", apperrors.ErrBookingHours)
	}

	bookings, err := s.repo.GetWorkingPeriodBookings(ctx, request.WorkingPeriodId)
	if err != nil {
		return err
	}

	for _, booking := range bookings {
		if timeutils.IsOverlapping(request.StartTime, request.EndTime, booking.StartTime, booking.EndTime) {
			return apperrors.NewUnprocessedEntity("Booking overlaps with existing booking", apperrors.ErrBookingHours)
		}
	}

	scheduledEvents, err := s.repo.GetWorkingPeriodScheduledEvents(ctx, request.WorkingPeriodId)
	if err != nil {
		return err
	}

	for _, event := range scheduledEvents {
		if timeutils.IsOverlapping(request.StartTime, request.EndTime, event.StartTime, event.EndTime) {
			return apperrors.NewUnprocessedEntity("Booking overlaps with scheduled event", apperrors.ErrBookingHours)
		}
	}
	return nil
}
