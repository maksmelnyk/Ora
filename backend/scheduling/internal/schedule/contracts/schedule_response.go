package contracts

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"

	"github.com/maksmelnyk/scheduling/internal/utils"
)

type ScheduleResponse struct {
	WorkingPeriods  []*WorkingPeriodResponse
	ScheduledEvents []*ScheduledEventResponse
	Bookings        []*BookingResponse
}

type WorkingPeriodResponse struct {
	Id        int64     `json:"id"`
	Date      time.Time `json:"date"`
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
}

type ScheduledEventResponse struct {
	Id              int64     `json:"id"`
	SessionId       int64     `json:"sessionId"`
	WorkingPeriodId int64     `json:"workingPeriodId"`
	StartTime       time.Time `json:"startTime"`
	EndTime         time.Time `json:"endTime"`
	MaxParticipants int       `json:"maxParticipants"`
}

type BookingResponse struct {
	Id               int64     `json:"id"`
	WorkingPeriodId  int64     `json:"workingPeriodId"`
	SessionId        int64     `json:"sessionId"`
	ScheduledEventId *int64    `json:"scheduledEventId"`
	StudentId        uuid.UUID `json:"studentId"`
	StartTime        time.Time `json:"startTime"`
	EndTime          time.Time `json:"endTime"`
	Status           int       `json:"status"`
}

func (w WorkingPeriodResponse) MarshalJSON() ([]byte, error) {
	type Alias WorkingPeriodResponse
	return json.Marshal(&struct {
		Date      string `json:"date"`
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
		*Alias
	}{
		Date:      w.Date.Format(utils.DateFormat),
		StartTime: w.StartTime.Format(utils.TimeFormat),
		EndTime:   w.EndTime.Format(utils.TimeFormat),
		Alias:     (*Alias)(&w),
	})
}

func (s ScheduledEventResponse) MarshalJSON() ([]byte, error) {
	type Alias ScheduledEventResponse
	return json.Marshal(&struct {
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
		*Alias
	}{
		StartTime: s.StartTime.Format(utils.TimeFormat),
		EndTime:   s.EndTime.Format(utils.TimeFormat),
		Alias:     (*Alias)(&s),
	})
}

func (b BookingResponse) MarshalJSON() ([]byte, error) {
	type Alias BookingResponse
	return json.Marshal(&struct {
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
		*Alias
	}{
		StartTime: b.StartTime.Format(utils.TimeFormat),
		EndTime:   b.EndTime.Format(utils.TimeFormat),
		Alias:     (*Alias)(&b),
	})
}
