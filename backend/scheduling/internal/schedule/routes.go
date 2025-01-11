package schedule

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/maksmelnyk/scheduling/internal/auth"
	"github.com/maksmelnyk/scheduling/internal/middleware"
)

func Routes(handler *ScheduleHandler) http.Handler {
	r := chi.NewRouter()

	// Define routes
	r.Get("/{userId}/schedule", handler.GetUserSchedule)
	r.With(middleware.RoleAuthMiddleware(auth.TeacherRole)).Post("/working-periods", handler.AddWorkingPeriod)
	r.With(middleware.RoleAuthMiddleware(auth.TeacherRole)).Put("/working-periods/{id}", handler.UpdateWorkingPeriod)
	r.With(middleware.RoleAuthMiddleware(auth.TeacherRole)).Delete("/working-periods/{id}", handler.DeleteWorkingPeriod)
	r.With(middleware.RoleAuthMiddleware(auth.TeacherRole)).Post("/working-periods/{workingPeriodId}/events", handler.AddScheduledEvent)
	r.With(middleware.RoleAuthMiddleware(auth.TeacherRole)).Delete("/events/{id}", handler.DeleteScheduledEvent)

	return r
}
