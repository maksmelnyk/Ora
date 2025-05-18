package schedule

import (
	"context"
	"fmt"
	"time"

	"github.com/maksmelnyk/scheduling/internal/apperrors"
	"github.com/maksmelnyk/scheduling/internal/database/entities"
	"github.com/maksmelnyk/scheduling/internal/timeutils"
)

func (s *ScheduleService) validateScheduledEventTiming(start, end time.Time, wpStart, wpEnd time.Time) error {
	if !timeutils.IsWithinPeriod(start, end, wpStart, wpEnd) {
		return apperrors.NewUnprocessedEntity("Scheduled event outside working hours", apperrors.ErrScheduledEventHours)
	}
	return nil
}

func (s *ScheduleService) checkScheduledEventConflicts(ctx context.Context, workingPeriodId int64, start, end time.Time) error {
	bookings, err := s.repo.GetWorkingPeriodBookings(ctx, []int64{workingPeriodId})
	if err != nil {
		return fmt.Errorf("get bookings: %w", err)
	}
	for _, b := range bookings {
		if timeutils.IsOverlapping(start, end, b.StartTime, b.EndTime) {
			return apperrors.NewUnprocessedEntity("Scheduled event overlaps with a booking", apperrors.ErrScheduledEventHours)
		}
	}

	events, err := s.repo.GetWorkingPeriodScheduledEvents(ctx, []int64{workingPeriodId})
	if err != nil {
		return fmt.Errorf("get scheduled events: %w", err)
	}
	for _, e := range events {
		if timeutils.IsOverlapping(start, end, e.StartTime, e.EndTime) {
			return apperrors.NewUnprocessedEntity("Scheduled event overlaps with another scheduled event", apperrors.ErrScheduledEventHours)
		}
	}

	return nil
}

func (s *ScheduleService) validateWorkingPeriodOverlap(existing []*entities.WorkingPeriod, currentId *int64, start, end time.Time) error {
	for _, wp := range existing {
		if currentId != nil && *currentId == wp.Id {
			continue
		}
		if timeutils.IsOverlapping(start, end, wp.StartTime, wp.EndTime) {
			return apperrors.NewUnprocessedEntity("Working period overlaps with existing working period", apperrors.ErrWorkingPeriodHours)
		}
	}
	return nil
}

func (s *ScheduleService) hasLinkedEvents(ctx context.Context, id int64) error {
	hasEvent, err := s.repo.HasLinkedEvents(ctx, id)
	if err != nil {
		s.log.Error("failed to check if booking exists", err)
		return err
	}

	if hasEvent {
		return apperrors.NewConflict("Cannot update working period with linked events", apperrors.ErrWorkingPeriodHasEvent)
	}
	return nil
}
