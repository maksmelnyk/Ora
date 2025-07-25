package booking

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/maksmelnyk/scheduling/internal/database"
	"github.com/maksmelnyk/scheduling/internal/database/entities"
)

type BookingRepo struct {
	db *sqlx.DB
}

func NewBookingRepository(db *sqlx.DB) *BookingRepo {
	return &BookingRepo{db: db}
}

// GetEducatorBookingById GetBookingById retrieves a single booking by its Id and EducatorId
func (r *BookingRepo) GetEducatorBookingById(ctx context.Context, educatorId uuid.UUID, id int64) (*entities.Booking, error) {
	const query = `
        SELECT id, educator_id, student_id, enrollment_id, product_id, scheduled_event_id, working_period_id, start_time, end_time, status, created_at, updated_at
        FROM booking
        WHERE id = $1 AND educator_Id = $2
    `
	return database.FetchSingle[entities.Booking](ctx, r.db, query, id, educatorId)
}

// GetWorkingPeriodById retrieves a single working period by its Id and UserId
func (r *BookingRepo) GetWorkingPeriodById(ctx context.Context, userId uuid.UUID, id int64) (*entities.WorkingPeriod, error) {
	const query = `
        SELECT id, user_id, start_time, end_time, created_at, updated_at
        FROM working_period
        WHERE user_id = $1 AND id = $2
    `
	return database.FetchSingle[entities.WorkingPeriod](ctx, r.db, query, userId, id)
}

// GetBookingsByUserId retrieves bookings for a specific user
func (r *BookingRepo) GetBookingsByUserId(ctx context.Context, userId uuid.UUID, upcomingAfter *time.Time, skip int, take int) ([]*entities.Booking, error) {
	query := `
		SELECT id, educator_id, student_id, enrollment_id, product_id, scheduled_event_id, working_period_id, start_time, end_time, status, created_at, updated_at
		FROM booking
		WHERE student_id = $1
	`
	args := []any{userId}
	argIndex := 2

	if upcomingAfter != nil {
		query += fmt.Sprintf(" AND start_time > $%d", argIndex)
		args = append(args, *upcomingAfter)
		argIndex++
	}

	query += fmt.Sprintf(" ORDER BY start_time DESC OFFSET $%d LIMIT $%d", argIndex, argIndex+1)
	args = append(args, skip, take)

	return database.FetchMultiple[entities.Booking](ctx, r.db, query, args...)
}

// GetWorkingPeriodBookings retrieves bookings for a specific working period
func (r *BookingRepo) GetWorkingPeriodBookings(ctx context.Context, workingPeriodId int64) ([]*entities.Booking, error) {
	const query = `
		SELECT id, educator_id, student_id, enrollment_id, product_id, scheduled_event_id, working_period_id, start_time, end_time, status, created_at, updated_at
		FROM booking
		WHERE working_period_id = $1
	`
	return database.FetchMultiple[entities.Booking](ctx, r.db, query, workingPeriodId)
}

// GetScheduledEvents retrieves scheduled events for a specific working period
func (r *BookingRepo) GetWorkingPeriodScheduledEvents(ctx context.Context, workingPeriodId int64) ([]*entities.ScheduledEvent, error) {
	const query = `
        SELECT id, user_id, product_id, lesson_id, title, working_period_id, start_time, end_time, max_participants, created_at, updated_at
        FROM scheduled_event
        WHERE working_period_id = $1
    `
	return database.FetchMultiple[entities.ScheduledEvent](ctx, r.db, query, workingPeriodId)
}

func (r *BookingRepo) GetLessonsScheduledEvents(ctx context.Context, lessonIds []int64) ([]*entities.ScheduledEvent, error) {
	const query = `
		SELECT id, user_id, product_id, lesson_id, title, working_period_id, start_time, end_time, max_participants, created_at, updated_at
		FROM scheduled_event
		WHERE lesson_id = ANY($1)
	`
	return database.FetchMultiple[entities.ScheduledEvent](ctx, r.db, query, pq.Array(lessonIds))
}

func (r *BookingRepo) GetScheduledEventById(ctx context.Context, id int64) (*entities.ScheduledEvent, error) {
	const query = `
		SELECT id, user_id, product_id, lesson_id, title, working_period_id, start_time, end_time, max_participants, created_at, updated_at
		FROM scheduled_event
		WHERE id = $1
	`
	return database.FetchSingle[entities.ScheduledEvent](ctx, r.db, query, id)
}

func (r *BookingRepo) HasBookingByEnrollmentId(ctx context.Context, enrollmentId int64) (bool, error) {
	const query = `
		SELECT COUNT(*) > 0
		FROM booking
		WHERE scheduled_event_id = $1 AND (status = $2 OR status = $3) 
	`
	return database.CheckExists(ctx, r.db, query, enrollmentId, entities.Approved, entities.Pending)
}

// AddBooking adds a new booking
func (r *BookingRepo) AddBooking(ctx context.Context, booking *entities.Booking) error {
	const query = `
        INSERT INTO booking (educator_id, student_id, product_id, enrollment_id, scheduled_event_id, working_period_id, title, start_time, end_time, status, created_at, updated_at)
        VALUES (:educator_id, :student_id, :product_id, :enrollment_id, :scheduled_event_id, :working_period_id, :title, :start_time, :end_time, :status, :created_at, :updated_at)
    `
	return database.ExecNamedQuery(ctx, r.db, query, booking)
}

// AddBookings adds multiple bookings
func (r *BookingRepo) AddBookings(ctx context.Context, bookings []*entities.Booking) error {
	items := make([]any, len(bookings))
	for i, b := range bookings {
		items[i] = b
	}

	return database.ExecInsertMany(ctx, r.db, "booking", items, "id")
}

// SetBookingStatus updates status of a booking
func (r *BookingRepo) SetBookingStatus(ctx context.Context, id int64, educatorId uuid.UUID, status int) error {
	const query = `UPDATE booking SET status = $3 WHERE id = $1 and educator_Id = $2`
	return database.ExecQuery(ctx, r.db, query, id, educatorId, status)
}
