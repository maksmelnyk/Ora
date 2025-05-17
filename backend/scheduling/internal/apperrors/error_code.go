package apperrors

const (
	ErrForbidden              = "ERROR_FORBIDDEN"
	ErrUnauthorized           = "ERROR_UNAUTHORIZED"
	ErrInternalError          = "ERROR_INTERNAL_ERROR"
	ErrValidationFailed       = "ERROR_VALIDATION_FAILED"
	ErrJsonDecodingFailed     = "ERROR_JSON_DECODING_FAILED"
	ErrParameterParsingFailed = "ERROR_PARAMETER_PARSING_FAILED"
	ErrParameterInvalid       = "ERROR_PARAMETER_INVALID"
	ErrResourceNotFound       = "ERROR_RESOURCE_NOT_FOUND"
	ErrBookingAlreadyExists   = "ERROR_BOOKING_ALREADY_EXISTS"
	ErrBookingHours           = "ERROR_BOOKING_HOURS"
	ErrBookingStatus          = "ERROR_BOOKING_STATUS"
	ErrScheduledEventHours    = "ERROR_SCHEDULED_EVENT_HOURS"
	ErrWorkingPeriodHours     = "ERROR_WORKING_PERIOD_HOURS"
	ErrWorkingPeriodHasEvents = "ERROR_WORKING_PERIOD_HAS_EVENTS"
)
