package database

import (
	"time"

	"github.com/google/uuid"

	_ "github.com/lib/pq"
)

type ScheduledEvent struct {
	Id              int64     `db:"id"`
	UserId          uuid.UUID `db:"user_id"`
	ProductId       int64     `db:"product_id"`
	LessonId        *int64    `db:"lesson_id"`
	Title           string    `db:"title"`
	WorkingPeriodId int64     `db:"working_period_id"`
	StartTime       time.Time `db:"start_time"`
	EndTime         time.Time `db:"end_time"`
	MaxParticipants int       `db:"max_participants"`
	CreatedAt       time.Time `db:"created_at"`
	UpdatedAt       time.Time `db:"updated_at"`
}
