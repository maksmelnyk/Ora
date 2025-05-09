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
	r.Get("/{userId}", handler.GetUserSchedule)
	r.Post("/scheduled-events/metadata", handler.GetScheduledEventMetadata)
	r.With(middleware.RoleAuthMiddleware(auth.EducatorRole)).Post("/working-periods", handler.AddWorkingPeriod)
	r.With(middleware.RoleAuthMiddleware(auth.EducatorRole)).Put("/working-periods/{id}", handler.UpdateWorkingPeriod)
	r.With(middleware.RoleAuthMiddleware(auth.EducatorRole)).Delete("/working-periods/{id}", handler.DeleteWorkingPeriod)
	r.With(middleware.RoleAuthMiddleware(auth.EducatorRole)).Post("/working-periods/{workingPeriodId}/events", handler.AddScheduledEvent)
	r.With(middleware.RoleAuthMiddleware(auth.EducatorRole)).Delete("/events/{id}", handler.DeleteScheduledEvent)

	return r
}
