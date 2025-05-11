from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
from pydantic import BaseModel, Field

from app.infrastructure.messaging.constants import RabbitMqConstants


class BaseEvent(BaseModel):
    """Base class for all events."""

    event_id: str = Field(default_factory=lambda: str(object=uuid4()))
    event_type: str
    correlation_id: str = Field(default_factory=lambda: str(object=uuid4()))
    timestamp: str = Field(
        default_factory=lambda: str(object=datetime.now(tz=timezone.utc).isoformat())
    )


class PaymentCompletedEvent(BaseEvent):
    """Event emitted when a payment has been completed."""

    event_type: str = Field(
        default=RabbitMqConstants.PAYMENT_COMPLETED, alias="eventType"
    )
    user_id: str = Field(alias="userId")
    product_id: int = Field(alias="productId")
    scheduled_event_id: Optional[int] = Field(alias="scheduledEventId")


class BookingCreationRequestedEvent(BaseEvent):
    """Event emitted when a payment has been completed"""

    event_type: str = Field(
        default=RabbitMqConstants.BOOKING_CREATION_REQUESTED, alias="eventType"
    )
    user_id: str = Field(alias="userId")
    scheduled_event_id: Optional[int] = Field(alias="scheduledEventId")
    lesson_ids: list[int] | None = Field(alias="lessonIds")
