package booking

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	h "github.com/maksmelnyk/scheduling/internal/database"
	e "github.com/maksmelnyk/scheduling/internal/database/entities"
)

type BookingRepo struct {
	db *sqlx.DB
}

func NewBookingRepository(db *sqlx.DB) *BookingRepo {
	return &BookingRepo{db: db}
}

// GetTeacherBookingById GetBookingById retrieves a single booking by its Id and TeacherId
func (r *BookingRepo) GetTeacherBookingById(ctx context.Context, teacherId uuid.UUID, id int64) (*e.Booking, error) {
	const query = `
        SELECT id, teacher_id, student_id, session_Id, scheduled_event_id, working_period_id, start_time, end_time, status, created_at, updated_at
        FROM booking
        WHERE id = $1 AND teacher_id = $2
    `
	return h.FetchSingle[e.Booking](ctx, r.db, query, id, teacherId)
}

// GetWorkingPeriodById retrieves a single working period by its Id and UserId
func (r *BookingRepo) GetWorkingPeriodById(ctx context.Context, userId uuid.UUID, id int64) (*e.WorkingPeriod, error) {
	const query = `
        SELECT id, user_id, date, start_time, end_time, created_at, updated_at
        FROM working_period
        WHERE user_id = $1 AND id = $2
    `
	return h.FetchSingle[e.WorkingPeriod](ctx, r.db, query, userId, id)
}

// GetScheduledEvents retrieves scheduled events for a specific working period
func (r *BookingRepo) GetScheduledEvents(ctx context.Context, workingPeriodId int64) ([]*e.ScheduledEvent, error) {
	const query = `
        SELECT id, session_id, working_period_id, user_id, start_time, end_time, max_participants, created_at, updated_at
        FROM scheduled_event
        WHERE working_period_id = $1
    `
	return h.FetchMultiple[e.ScheduledEvent](ctx, r.db, query, workingPeriodId)
}

// AddBooking adds a new booking
func (r *BookingRepo) AddBooking(ctx context.Context, b *e.Booking) error {
	const query = `
        INSERT INTO booking (teacher_id, student_id, session_id, scheduled_event_id, working_period_id, start_time, end_time, status, created_at, updated_at)
        VALUES (:teacher_id, :student_id, :session_id, :scheduled_event_id, :working_period_id, :start_time, :end_time, :status, :created_at, :updated_at)
    `
	return h.ExecNamedQuery(ctx, r.db, query, b)
}

// SetBookingStatus updates status of a booking
func (r *BookingRepo) SetBookingStatus(ctx context.Context, id int64, teacherId uuid.UUID, status int) error {
	const query = `UPDATE booking SET status = $3 WHERE id = $1 and teacher_id = $2`
	return h.ExecQuery(ctx, r.db, query, id, teacherId, status)
}
