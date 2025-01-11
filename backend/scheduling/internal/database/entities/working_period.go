package database

import (
	"time"

	"github.com/google/uuid"

	_ "github.com/lib/pq"
)

type WorkingPeriod struct {
	Id        int64     `db:"id"`
	UserId    uuid.UUID `db:"user_id"`
	Date      time.Time `db:"date"`
	StartTime time.Time `db:"start_time"`
	EndTime   time.Time `db:"end_time"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}
