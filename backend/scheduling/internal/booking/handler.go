package booking

import (
	"encoding/json"
	"net/http"

	"github.com/maksmelnyk/scheduling/internal/api"
	"github.com/maksmelnyk/scheduling/internal/apperrors"
	"github.com/maksmelnyk/scheduling/internal/database/entities"
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
	var request *BookingRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		api.WriteError(w, apperrors.NewBadRequestError(err.Error(), apperrors.ErrJsonDecodingFailed))
		return
	}

	if err := request.Validate(); err != nil {
		api.WriteError(w, err)
		return
	}

	err = h.service.AddBooking(r.Context(), request, r.Header.Get("Authorization"))
	if err != nil {
		api.WriteError(w, err)
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
	id, err := api.ParseLongParam(w, r, "id")
	if err != nil {
		api.WriteError(w, apperrors.NewBadRequestError(err.Error(), apperrors.ErrParameterParsingFailed))
		return
	}

	err = h.service.UpdateBookingStatus(r.Context(), id, int(entities.Approved))
	if err != nil {
		api.WriteError(w, err)
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
	id, err := api.ParseLongParam(w, r, "id")
	if err != nil {
		api.WriteError(w, apperrors.NewBadRequestError(err.Error(), apperrors.ErrParameterParsingFailed))
		return
	}

	err = h.service.UpdateBookingStatus(r.Context(), id, int(entities.Cancelled))
	if err != nil {
		api.WriteError(w, err)
	}
	w.WriteHeader(http.StatusCreated)
}
