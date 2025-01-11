package booking

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func Routes(handler *BookingHandler) http.Handler {
	r := chi.NewRouter()

	// Define routes
	r.Post("/", handler.AddBooking)
	r.Post("/{id}/status/{status}", handler.UpdateBookingStatus)

	return r
}
