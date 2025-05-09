import json
from loguru import logger
from typing import Any, Dict, List
from aio_pika.abc import AbstractIncomingMessage

from app.core.messaging.constants import RabbitMqConstants
from app.core.messaging.consumers.consumer import Consumer


class DeadLetterQueueConsumer(Consumer):
    """Consumer for the dead letter queue."""

    @property
    def queue_name(self) -> str:
        return RabbitMqConstants.PAYMENT_DLQ_NAME

    @property
    def routing_patterns(self) -> List[str]:
        return [RabbitMqConstants.PAYMENT_DLQ_ROUTING_KEY]

    async def handle_message(
        self,
        message_body: str,
        headers: Dict[str, Any],
        message: AbstractIncomingMessage,
    ) -> bool:
        """Handle a message from the dead letter queue."""
        message_id: str = message.message_id or "unknown"
        event_type: Any = headers.get("__TypeId__", "unknown")

        logger.error(
            f"DLQ message received: messageId={message_id}, eventType={event_type}"
        )

        message_headers: Dict[str, Any] = message.headers or {}
        if "x-death" in message_headers:
            x_death = message.headers["x-death"]
            if isinstance(x_death, list) and len(x_death) > 0:
                for death_info in x_death:
                    if isinstance(death_info, dict):
                        count: Any = death_info.get("count", "n/a")
                        reason: Any = death_info.get("reason", "n/a")
                        queue: Any = death_info.get("queue", "n/a")
                        exchange: Any = death_info.get("exchange", "n/a")
                        routing_keys: Any = death_info.get("routing-keys", ["n/a"])
                        routing_key: Any = routing_keys[0] if routing_keys else "n/a"

                        logger.warning(
                            f"x-death entry: count={count}, reason={reason}, "
                            f"queue={queue}, exchange={exchange}, routingKey={routing_key}"
                        )
        else:
            logger.warning(f"No x-death headers found for DLQ message {message_id}")

        try:
            json_data = json.loads(message_body)
            correlation_id = json_data.get("correlation_id", "unknown")
            timestamp = json_data.get("timestamp", "unknown")

            logger.warning(
                f"Parsed DLQ Event: type={event_type}, id={message_id}, "
                f"timestamp={timestamp}, correlationId={correlation_id}"
            )

            # TODO: DLQ handling actions:
            # 1. Send alerts to monitoring system
            # 2. Store the failed message for later analysis or manual retry

            return True

        except json.JSONDecodeError as e:
            logger.error(f"Failed to deserialize DLQ message: {message_body}")
            return True

        except Exception as e:
            logger.error(f"Unexpected error processing DLQ message: {e}")
            return True
