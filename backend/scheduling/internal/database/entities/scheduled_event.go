package database

import (
	"time"

	"github.com/google/uuid"

	_ "github.com/lib/pq"
)

type ScheduledEvent struct {
	Id              int64     `db:"id"`
	SessionId       int64     `db:"session_id"`
	WorkingPeriodId int64     `db:"working_period_id"`
	UserId          uuid.UUID `db:"user_id"`
	StartTime       time.Time `db:"start_time"`
	EndTime         time.Time `db:"end_time"`
	MaxParticipants int       `db:"max_participants"`
	CreatedAt       time.Time `db:"created_at"`
	UpdatedAt       time.Time `db:"updated_at"`
}
