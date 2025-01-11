package booking

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"

	"github.com/maksmelnyk/scheduling/internal/utils"
	"github.com/maksmelnyk/scheduling/internal/validation"
)

type BookingRequest struct {
	TeacherId        uuid.UUID
	SessionId        int64
	ScheduledEventId *int64
	WorkingPeriodId  int64
	StartTime        time.Time
	EndTime          time.Time
}

func (b *BookingRequest) UnmarshalJSON(data []byte) error {
	type Alias BookingRequest
	aux := &struct {
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
		*Alias
	}{
		Alias: (*Alias)(b),
	}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	var err error
	b.StartTime, err = time.Parse(utils.TimeFormat, aux.StartTime)
	if err != nil {
		return err
	}

	b.EndTime, err = time.Parse(utils.TimeFormat, aux.EndTime)
	if err != nil {
		return err
	}

	return nil
}

func (b *BookingRequest) Validate() error {
	if b.TeacherId == uuid.Nil {
		return validation.NewValidationError("TeacherId", "must not be nil")
	}
	if b.StartTime.IsZero() || b.EndTime.IsZero() {
		return validation.NewValidationError("StartTime/EndTime", "must not be empty")
	}
	if b.StartTime.After(b.EndTime) {
		return validation.NewValidationError("StartTime", "must be before EndTime")
	}
	return nil
}
