package schedule

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	ec "github.com/maksmelnyk/scheduling/internal/errors"
	hh "github.com/maksmelnyk/scheduling/internal/http"
)

type ScheduleHandler struct {
	service *ScheduleService
}

func NewScheduleHandler(service *ScheduleService) *ScheduleHandler {
	return &ScheduleHandler{service: service}
}

// GetUserSchedule retrieves a user's schedule within a specified date range.
// @Summary      Retrieve user schedule
// @Description  Retrieves the schedule for a given user using a date range defined by 'fromDate' and 'toDate' query parameters.
// @Tags         Schedule
// @Accept       json
// @Produce      json
// @Param        userId    path      string  true  "User ID (UUID)"
// @Param        fromDate  query     string  true  "Start date in YYYY-MM-DDTHH:MM:SSZ format"
// @Param        toDate    query     string  true  "End date in YYYY-MM-DDTHH:MM:SSZ format"
// @Success      200       {object}  ScheduleResponse  "User schedule data"
// @Failure      400       {object}  error         	   "Invalid input parameters"
// @Router       /api/v1/schedules/{userId} [get]
// @Security 	 BearerAuth
func (h *ScheduleHandler) GetUserSchedule(w http.ResponseWriter, r *http.Request) {
	userId, err := uuid.Parse(chi.URLParam(r, "userId"))
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Invalid user ID"))
		return
	}

	fromDate, err := time.Parse(time.RFC3339, r.URL.Query().Get("fromDate"))
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "fromDate is required"))
		return
	}

	toDate, err := time.Parse(time.RFC3339, r.URL.Query().Get("toDate"))
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "toDate is required"))
		return
	}

	schedule, err := h.service.GetScheduleByUserId(r.Context(), userId, fromDate, toDate)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	hh.WriteJson(w, http.StatusOK, schedule)
}

// GetScheduledEventMetadata retrieves metadata for a scheduled event.
// @Summary      Retrieve scheduled event metadata
// @Description  Retrieves the schedule for a given user using a date range defined by 'fromDate' and 'toDate' query parameters.
// @Tags         Schedule
// @Accept       json
// @Produce      json
// @Param        id    	   path      string  true  					 "Scheduled Event ID (long)"
// @Success      200       {object}  ScheduledEventMetadataResponse  "User schedule data"
// @Failure      400       {object}  error         	   				 "Invalid input parameters"
// @Router       /api/v1/schedules/scheduled-events/metadata [post]
// @Security 	 BearerAuth
func (h *ScheduleHandler) GetScheduledEventMetadata(w http.ResponseWriter, r *http.Request) {
	var semr *ScheduledEventMetadataRequest
	err := json.NewDecoder(r.Body).Decode(&semr)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Error parsing request body"))
		return
	}

	schedule, err := h.service.GetScheduledEventMetadata(r.Context(), semr)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	hh.WriteJson(w, http.StatusOK, schedule)
}

// AddWorkingPeriod adds a new working period for an educator.
// @Summary      Add working period
// @Description  Creates a new working period using the provided details. The working period must be valid and meet all required criteria.
// @Tags         Schedule
// @Accept       json
// @Produce      json
// @Param        workingPeriod  body      WorkingPeriodRequest  true  "Working period details"
// @Success      201            "Working period created successfully"
// @Failure      400            {object}  error                "Invalid input"
// @Router       /api/v1/schedules/working-periods [post]
// @Security 	 BearerAuth
func (h *ScheduleHandler) AddWorkingPeriod(w http.ResponseWriter, r *http.Request) {
	var workingPeriod *WorkingPeriodRequest
	err := json.NewDecoder(r.Body).Decode(&workingPeriod)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Error parsing request body"))
		return
	}

	if err := workingPeriod.Validate(); err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), err.Error()))
		return
	}

	err = h.service.AddWorkingPeriod(r.Context(), workingPeriod)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// UpdateWorkingPeriod updates an existing working period.
// @Summary      Update working period
// @Description  Updates the specified working period with new details provided in the request body.
// @Tags         Schedule
// @Accept       json
// @Produce      json
// @Param        id             path      int                  true  "Working period ID"
// @Param        workingPeriod  body      WorkingPeriodRequest true  "Updated working period details"
// @Success      204            "Working period updated successfully"
// @Failure      400            {object}  error                "Invalid input"
// @Router       /api/v1/schedules/working-periods/{id} [put]
// @Security 	 BearerAuth
func (h *ScheduleHandler) UpdateWorkingPeriod(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	var workingPeriod *WorkingPeriodRequest
	err = json.NewDecoder(r.Body).Decode(&workingPeriod)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Error parsing request body"))
		return
	}

	if err := workingPeriod.Validate(); err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), err.Error()))
		return
	}

	err = h.service.UpdateWorkingPeriod(r.Context(), id, workingPeriod)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// DeleteWorkingPeriod deletes a working period.
// @Summary      Delete working period
// @Description  Deletes the working period identified by the provided ID.
// @Tags         Schedule
// @Produce      json
// @Param        id  path  int  true  "Working period ID"
// @Success      204 "Working period deleted successfully"
// @Failure      400 {object}  error   "Invalid input"
// @Router       /api/v1/schedules/working-periods/{id} [delete]
// @Security 	 BearerAuth
func (h *ScheduleHandler) DeleteWorkingPeriod(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	err = h.service.DeleteWorkingPeriod(r.Context(), id)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// AddScheduledEvent adds a scheduled event to a working period.
// @Summary      Add scheduled event
// @Description  Creates a new scheduled event for a specific working period using the provided event details.
// @Tags         Schedule
// @Accept       json
// @Produce      json
// @Param        workingPeriodId  path      int                    true  "Working period ID"
// @Param        event            body      ScheduledEventRequest  true  "Scheduled event details"
// @Success      201              "Scheduled event created successfully"
// @Failure      400              {object}  error                  "Invalid input"
// @Router       /api/v1/schedules/working-periods/{workingPeriodId}/events [post]
// @Security 	 BearerAuth
func (h *ScheduleHandler) AddScheduledEvent(w http.ResponseWriter, r *http.Request) {
	workingPeriodId, err := strconv.ParseInt(chi.URLParam(r, "workingPeriodId"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	var scheduledEvent *ScheduledEventRequest
	err = json.NewDecoder(r.Body).Decode(&scheduledEvent)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Error parsing request body"))
		return
	}

	if err := scheduledEvent.Validate(); err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), err.Error()))
		return
	}

	err = h.service.AddScheduledEvent(r.Context(), workingPeriodId, scheduledEvent, r.Header.Get("Authorization"))
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// DeleteScheduledEvent deletes a scheduled event.
// @Summary      Delete scheduled event
// @Description  Deletes a scheduled event by its ID.
// @Tags         Schedule
// @Produce      json
// @Param        id  path  int  true	"Event ID"
// @Success      204 "Scheduled event	deleted successfully"
// @Failure      400 {object}   error	"Invalid input"
// @Router       /api/v1/schedules/events/{id} [delete]
// @Security 	 BearerAuth
func (h *ScheduleHandler) DeleteScheduledEvent(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	err = h.service.DeleteScheduledEvent(r.Context(), id)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
