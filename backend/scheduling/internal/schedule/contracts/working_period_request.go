package contracts

import (
	"encoding/json"
	"time"

	"github.com/maksmelnyk/scheduling/internal/utils"
	"github.com/maksmelnyk/scheduling/internal/validation"
)

type WorkingPeriodRequest struct {
	Date      time.Time
	StartTime time.Time
	EndTime   time.Time
}

func (w *WorkingPeriodRequest) UnmarshalJSON(data []byte) error {
	type Alias WorkingPeriodRequest
	aux := &struct {
		Date      string `json:"date"`
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
		*Alias
	}{
		Alias: (*Alias)(w),
	}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	var err error
	w.Date, err = time.Parse(utils.DateFormat, aux.Date)
	if err != nil {
		return err
	}

	w.StartTime, err = time.Parse(utils.TimeFormat, aux.StartTime)
	if err != nil {
		return err
	}

	w.EndTime, err = time.Parse(utils.TimeFormat, aux.EndTime)
	if err != nil {
		return err
	}

	return nil
}

func (w *WorkingPeriodRequest) Validate() error {
	if w.Date.Before(time.Now().Truncate(24 * time.Hour)) {
		return validation.NewValidationError("Date", "must not be in the past")
	}
	if w.StartTime.After(w.EndTime) {
		return validation.NewValidationError("StartTime", "must be before EndTime")
	}
	return nil
}
