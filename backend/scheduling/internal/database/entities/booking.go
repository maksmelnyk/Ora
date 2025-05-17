package entities

import (
	"time"

	"github.com/google/uuid"

	_ "github.com/lib/pq"
)

type Booking struct {
	Id               int64         `db:"id"`
	EducatorId       uuid.UUID     `db:"educator_id"`
	StudentId        uuid.UUID     `db:"student_id"`
	ProductId        int64         `db:"product_id"`
	ScheduledEventId *int64        `db:"scheduled_event_id"`
	EnrollmentId     *int64        `db:"enrollment_id"` //TODO: fix later, maybe
	WorkingPeriodId  int64         `db:"working_period_id"`
	Title            string        `db:"title"`
	StartTime        time.Time     `db:"start_time"`
	EndTime          time.Time     `db:"end_time"`
	Status           BookingStatus `db:"status"`
	CreatedAt        time.Time     `db:"created_at"`
	UpdatedAt        time.Time     `db:"updated_at"`
}

type BookingStatus int

const (
	Pending BookingStatus = iota
	Approved
	Cancelled
)
