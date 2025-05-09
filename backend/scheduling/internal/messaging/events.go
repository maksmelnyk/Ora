package messaging

import (
	"time"

	"github.com/google/uuid"
)

type EventBase interface {
	GetEventId() string
	GetEventType() string
	GetCorrelationId() string
	GetTimestamp() string
}

type BaseEvent struct {
	EventId       string `json:"eventId"`
	EventType     string `json:"eventType"`
	CorrelationId string `json:"correlationId"`
	Timestamp     string `json:"timestamp"`
}

func (b BaseEvent) GetEventId() string       { return b.EventId }
func (b BaseEvent) GetEventType() string     { return b.EventType }
func (b BaseEvent) GetCorrelationId() string { return b.CorrelationId }
func (b BaseEvent) GetTimestamp() string     { return b.Timestamp }

type EventScheduledEvent struct {
	BaseEvent
	ProductId int64  `json:"productId"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
}

func NewEventScheduledEvent(
	productId int64,
	startTime string,
	endTime string,
) *EventScheduledEvent {
	return &EventScheduledEvent{
		BaseEvent: BaseEvent{
			EventId:       uuid.New().String(),
			EventType:     EventScheduled,
			CorrelationId: uuid.New().String(),
			Timestamp:     time.Now().UTC().Format(time.RFC3339),
		},
		ProductId: productId,
		StartTime: startTime,
		EndTime:   endTime,
	}
}

type BookingCompletedEvent struct {
	BaseEvent
	UserId       string `json:"userId"`
	EnrollmentId int64  `json:"enrollmentId"`
}

func NewBookingCompletedEvent(userId string, enrollmentId int64) *BookingCompletedEvent {
	return &BookingCompletedEvent{
		BaseEvent: BaseEvent{
			EventId:       uuid.New().String(),
			EventType:     BookingCompleted,
			CorrelationId: uuid.New().String(),
			Timestamp:     time.Now().UTC().Format(time.RFC3339),
		},
		UserId:       userId,
		EnrollmentId: enrollmentId,
	}
}

type BookingCreationRequestedEvent struct {
	BaseEvent
	UserId           string  `json:"userId"`
	ScheduledEventId *int64  `json:"scheduledEventId"`
	LessonIds        []int64 `json:"lessonIds"`
}

func NewBookingCreationRequestedEvent(userId, educatorId string, scheduledEventId *int64, lessonIds []int64) *BookingCreationRequestedEvent {
	return &BookingCreationRequestedEvent{
		BaseEvent: BaseEvent{
			EventId:       uuid.New().String(),
			EventType:     BookingCreationRequested,
			CorrelationId: uuid.New().String(),
			Timestamp:     time.Now().UTC().Format(time.RFC3339),
		},
		UserId:           userId,
		ScheduledEventId: scheduledEventId,
		LessonIds:        lessonIds,
	}
}
