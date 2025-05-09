package booking

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	e "github.com/maksmelnyk/scheduling/internal/database/entities"
	ec "github.com/maksmelnyk/scheduling/internal/errors"
	hh "github.com/maksmelnyk/scheduling/internal/http"
)

type BookingHandler struct {
	service *BookingService
}

func NewBookingHandler(service *BookingService) *BookingHandler {
	return &BookingHandler{service: service}
}

// AddBooking adds a new booking based on the provided request details.
// @Summary      Add a new booking
// @Description  Creates a new booking entry using the provided booking information.
// @Tags         Booking
// @Accept       json
// @Produce      json
// @Param        booking  body      BookingRequest  true  "Booking details"
// @Success      201      {string}  string          "Booking created successfully"
// @Failure      400      {object}  error 			"Invalid input"
// @Router       /api/v1/bookings/ [post]
// @Security 	 BearerAuth
func (h *BookingHandler) AddBooking(w http.ResponseWriter, r *http.Request) {
	var booking *BookingRequest
	err := json.NewDecoder(r.Body).Decode(&booking)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Error parsing request body"))
		return
	}

	if err := booking.Validate(); err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), err.Error()))
		return
	}

	err = h.service.AddBooking(r.Context(), booking, r.Header.Get("Authorization"))
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
	}
	w.WriteHeader(http.StatusCreated)
}

// ConfirmBooking.
// @Summary      Confirm booking
// @Description  Confirms an existing booking by setting its status to 'approved'.
// @Tags         Booking
// @Accept       json
// @Produce      json
// @Param        id      path      int     true  "Booking ID"
// @Success      201     {string}  string  "Status updated successfully"
// @Failure      400     {object}  error   "Invalid input"
// @Router       /api/v1/bookings/{id}/confirm [post]
// @Security 	 BearerAuth
func (h *BookingHandler) ConfirmBooking(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	err = h.service.UpdateBookingStatus(r.Context(), id, int(e.Approved))
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
	}
	w.WriteHeader(http.StatusCreated)
}

// CancelBooking.
// @Summary      Cancel booking
// @Description  Cancels an existing booking by setting its status to 'cancelled'.
// @Tags         Booking
// @Accept       json
// @Produce      json
// @Param        id      path      int     true  "Booking ID"
// @Success      201     {string}  string  "Status updated successfully"
// @Failure      400     {object}  error   "Invalid input"
// @Router       /api/v1/bookings/{id}/cancel [post]
// @Security 	 BearerAuth
func (h *BookingHandler) CancelBooking(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	err = h.service.UpdateBookingStatus(r.Context(), id, int(e.Cancelled))
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
	}
	w.WriteHeader(http.StatusCreated)
}
