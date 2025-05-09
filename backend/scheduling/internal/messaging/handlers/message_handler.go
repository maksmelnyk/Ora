package handlers

import (
	"context"
	"encoding/json"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/maksmelnyk/scheduling/internal/booking"
	"github.com/maksmelnyk/scheduling/internal/logger"
	"github.com/maksmelnyk/scheduling/internal/messaging"
)

type MessageHandler struct {
	log            *logger.AppLogger
	bookingService *booking.BookingService
}

func NewMessageHandler(log *logger.AppLogger, bookingService *booking.BookingService) *MessageHandler {
	return &MessageHandler{
		log:            log,
		bookingService: bookingService,
	}
}

func (mp *MessageHandler) HandleIncomingMessage(ctx context.Context, msg amqp.Delivery) error {
	eventType, ok := msg.Headers["__TypeId__"].(string)
	if !ok {
		mp.log.Warnf("Message %s missing or invalid __TypeId__ header", msg.MessageId)
		return fmt.Errorf("message missing type header")
	}

	switch eventType {
	case messaging.BookingCreationRequested:
		return handleBookingCreationRequestedEvent(ctx, msg, mp, eventType)
	default:
		mp.log.Warnf("Received unknown message type: '%s' for message %s", eventType, msg.MessageId)
		return fmt.Errorf("unknown message type: %s", eventType)
	}
}

func handleBookingCreationRequestedEvent(ctx context.Context, msg amqp.Delivery, mp *MessageHandler, eventType string) error {
	var event messaging.BookingCreationRequestedEvent
	if err := json.Unmarshal(msg.Body, &event); err != nil {
		mp.log.Errorf("Failed to unmarshal %s message %s: %v", eventType, msg.MessageId, err)
		return fmt.Errorf("failed to unmarshal %s message: %w", eventType, err)
	}

	err := mp.bookingService.AddAutoBooking(ctx, &event)
	if err != nil {
		mp.log.Errorf("Failed to perform scheduling task for message %s (EventID: %s): %v", msg.MessageId, event.EventId, err)
		return fmt.Errorf("failed to process scheduling task for event %s: %w", event.EventId, err)
	}

	mp.log.Infof("Successfully processed %s message %s (EventID: %s)", eventType, msg.MessageId, event.EventId)
	return nil
}
