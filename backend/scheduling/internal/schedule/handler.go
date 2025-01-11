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
	sc "github.com/maksmelnyk/scheduling/internal/schedule/contracts"
	u "github.com/maksmelnyk/scheduling/internal/utils"
)

type ScheduleHandler struct {
	service *ScheduleService
}

func NewScheduleHandler(service *ScheduleService) *ScheduleHandler {
	return &ScheduleHandler{service: service}
}

func (h *ScheduleHandler) GetUserSchedule(w http.ResponseWriter, r *http.Request) {
	userId, err := uuid.Parse(chi.URLParam(r, "userId"))
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Invalid user ID"))
		return
	}

	fromDate, err := time.Parse(u.DateFormat, r.URL.Query().Get("fromDate"))
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "fromDate is required"))
		return
	}

	toDate, err := time.Parse(u.DateFormat, r.URL.Query().Get("toDate"))
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "toDate is required"))
		return
	}

	if fromDate.After(toDate) {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "fromDate cannot be after toDate"))
		return
	}

	schedule, err := h.service.GetUserSchedule(r.Context(), userId, fromDate, toDate)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	hh.WriteJson(w, http.StatusOK, schedule)
}

func (h *ScheduleHandler) AddWorkingPeriod(w http.ResponseWriter, r *http.Request) {
	var workingPeriod *sc.WorkingPeriodRequest
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
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *ScheduleHandler) UpdateWorkingPeriod(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	var workingPeriod *sc.WorkingPeriodRequest
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

func (h *ScheduleHandler) AddScheduledEvent(w http.ResponseWriter, r *http.Request) {
	workingPeriodId, err := strconv.ParseInt(chi.URLParam(r, "workingPeriodId"), 10, 64)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "invalid ID"))
		return
	}

	var scheduledEvent *sc.ScheduledEventRequest
	err = json.NewDecoder(r.Body).Decode(&scheduledEvent)
	if err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), "Error parsing request body"))
		return
	}

	if err := scheduledEvent.Validate(); err != nil {
		hh.WriteError(w, hh.NewBadRequestError(ec.ErrInvalidInputParameters.Error(), err.Error()))
		return
	}

	err = h.service.AddScheduledEvent(r.Context(), workingPeriodId, scheduledEvent)
	if err != nil {
		hh.WriteError(w, hh.ParseError(err))
		return
	}

	w.WriteHeader(http.StatusCreated)
}

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
