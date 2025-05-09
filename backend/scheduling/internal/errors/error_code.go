package errors

import "errors"

var (
	ErrInternalError                    = errors.New("ERROR_INTERNAL_ERROR")
	ErrInvalidInputParameters           = errors.New("ERROR_INVALID_INPUT_PARAMETERS")
	ErrUserIdNotFound                   = errors.New("ERROR_USER_ID_NOT_FOUND")
	ErrAuthFailed                       = errors.New("ERROR_AUTHORIZATION_FAILED")
	ErrBookingNotFound                  = errors.New("ERROR_BOOKING_NOT_FOUND")
	ErrBookingAlreadyExists             = errors.New("ERROR_BOOKING_ALREADY_EXISTS")
	ErrBookingConflict                  = errors.New("ERROR_BOOKING_CONFLICT")
	ErrBookingStatusInvalid             = errors.New("ERROR_BOOKING_STATUS_INVALID")
	ErrBookingStatusUpdateRestricted    = errors.New("ERROR_BOOKING_STATUS_UPDATE_RESTRICTED")
	ErrScheduleEventNotFound            = errors.New("ERROR_SCHEDULE_EVENT_NOT_FOUND")
	ErrScheduleEventOutsideWorkingHours = errors.New("ERROR_SCHEDULE_EVENT_OUTSIDE_WORKING_HOURS")
	ErrScheduleEventOverlapBooking      = errors.New("ERROR_SCHEDULE_EVENT_OVERLAP_BOOKING")
	ErrWorkingPeriodNotFound            = errors.New("ERROR_WORKING_PERIOD_NOT_FOUND")
	ErrWorkingPeriodOverlap             = errors.New("ERROR_WORKING_PERIOD_OVERLAP")
)
