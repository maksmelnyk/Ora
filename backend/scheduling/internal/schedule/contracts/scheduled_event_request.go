package contracts

import (
	"encoding/json"
	"time"

	"github.com/maksmelnyk/scheduling/internal/utils"
	"github.com/maksmelnyk/scheduling/internal/validation"
)

type ScheduledEventRequest struct {
	SessionId       int64
	StartTime       time.Time
	EndTime         time.Time
	MaxParticipants int
}

func (s *ScheduledEventRequest) UnmarshalJSON(data []byte) error {
	type Alias ScheduledEventRequest
	aux := &struct {
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
		*Alias
	}{
		Alias: (*Alias)(s),
	}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	var err error
	s.StartTime, err = time.Parse(utils.TimeFormat, aux.StartTime)
	if err != nil {
		return err
	}

	s.EndTime, err = time.Parse(utils.TimeFormat, aux.EndTime)
	if err != nil {
		return err
	}

	return nil
}

func (s *ScheduledEventRequest) Validate() error {
	if s.SessionId <= 0 {
		return validation.NewValidationError("SessionId", "must be greater than 0")
	}
	if s.StartTime.After(s.EndTime) {
		return validation.NewValidationError("StartTime", "must be before EndTime")
	}
	if s.MaxParticipants <= 0 {
		return validation.NewValidationError("MaxParticipants", "must be greater than 0")
	}
	return nil
}
