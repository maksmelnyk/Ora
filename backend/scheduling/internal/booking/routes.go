package booking

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/maksmelnyk/scheduling/internal/auth"
	"github.com/maksmelnyk/scheduling/internal/middleware"
)

func Routes(handler *BookingHandler) http.Handler {
	r := chi.NewRouter()

	// Define routes
	r.Post("/", handler.AddBooking)
	r.With(middleware.RoleAuthMiddleware(auth.EducatorRole)).Post("/{id}/confirm", handler.ConfirmBooking)
	r.With(middleware.RoleAuthMiddleware(auth.EducatorRole)).Post("/{id}/cancel", handler.CancelBooking)

	return r
}
