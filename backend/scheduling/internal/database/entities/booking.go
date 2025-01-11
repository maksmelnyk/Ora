package database

import (
	"time"

	"github.com/google/uuid"

	_ "github.com/lib/pq"
)

type Booking struct {
	Id               int64     `db:"id"`
	TeacherId        uuid.UUID `db:"teacher_id"`
	StudentId        uuid.UUID `db:"student_id"`
	SessionId        int64     `db:"session_id"`
	ScheduledEventId *int64    `db:"scheduled_event_id"`
	WorkingPeriodId  int64     `db:"working_period_id"`
	StartTime        time.Time `db:"start_time"`
	EndTime          time.Time `db:"end_time"`
	Status           int       `db:"status"`
	CreatedAt        time.Time `db:"created_at"`
	UpdatedAt        time.Time `db:"updated_at"`
}

type BookingStatus int

const (
	Pending BookingStatus = iota
	Approved
	Rejected
)
