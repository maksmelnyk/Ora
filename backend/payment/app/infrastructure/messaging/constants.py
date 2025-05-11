class RabbitMqConstants:
    """Constants for RabbitMQ routing and event types."""

    PAYMENT_QUEUE_NAME = "payment-events-queue"
    PAYMENT_DLQ_NAME = "payment-events-dlq"
    PAYMENT_DLQ_ROUTING_KEY = "dlq.payment"

    # Service-specific routing patterns
    PAYMENT_TO_LEARNING_PATTERN = "payment.to.learning.#"
    LEARNING_TO_PAYMENT_PATTERN = "learning.to.payment.#"

    # Event-specific routing keys
    PAYMENT_COMPLETED_KEY = "payment.to.learning.payment.completed"
    BOOKING_CREATION_REQUESTED_KEY = "payment.to.scheduling.booking.requested"

    # Event types
    PAYMENT_COMPLETED = "PAYMENT_COMPLETED"
    BOOKING_CREATION_REQUESTED = "BOOKING_CREATION_REQUESTED"
