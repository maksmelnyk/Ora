package booking

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	ec "github.com/maksmelnyk/scheduling/internal/errors"
	hh "github.com/maksmelnyk/scheduling/internal/http"
)

type BookingHandler struct {
	service *BookingService
}

func NewBookingHandler(service *BookingService) *BookingHandler {
	return &BookingHandler{service: service}
}

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

	err = h.service.AddBooking(r.Context(), booking)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *BookingHandler) UpdateBookingStatus(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	status, err := strconv.Atoi(chi.URLParam(r, "status"))
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	err = h.service.UpdateBookingStatus(r.Context(), id, status)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
	}

	w.WriteHeader(http.StatusCreated)
}
