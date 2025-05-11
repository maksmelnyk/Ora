import asyncio
from typing import TypeVar
from loguru import logger
from datetime import datetime, timezone

from aio_pika import Message, DeliveryMode
from aio_pika.abc import AbstractExchange
from aio_pika.exceptions import DeliveryError

from app.config.settings import RabbitMqSettings
from app.infrastructure.messaging.connection_provider import RabbitMqConnectionProvider
from app.infrastructure.messaging.events import BaseEvent


T = TypeVar("T", bound=BaseEvent)


class Publisher:
    """Publishes events to RabbitMQ with confirmation."""

    def __init__(
        self, connection_provider: RabbitMqConnectionProvider, config: RabbitMqSettings
    ) -> None:
        self.connection_provider: RabbitMqConnectionProvider = connection_provider
        self.config: RabbitMqSettings = config

    async def initialize(self) -> None:
        """Initialize the publisher."""
        await self.connection_provider.initialize()
        logger.debug("Event publisher initialized (connection provider ready).")

    async def publish_event(self, routing_key: str, event: BaseEvent) -> bool:
        message_id: str = event.event_id
        correlation_id: str = event.correlation_id
        event_type: str = event.event_type

        try:
            event_json: str = event.model_dump_json(by_alias=True)

            message = Message(
                body=event_json.encode(),
                content_type="application/json",
                message_id=message_id,
                correlation_id=correlation_id,
                timestamp=datetime.now(tz=timezone.utc),
                delivery_mode=DeliveryMode.PERSISTENT,
                headers={"__TypeId__": event_type},
            )

            logger.debug(
                f"Publishing message: id={message_id}, type={event_type}, routing_key={routing_key}, correlation_id={correlation_id}"
            )

            confirmation_timeout: float = (
                self.config.publisher_confirm_timeout_ms / 1000
            )

            async with self.connection_provider.acquire_channel() as channel:
                exchange: AbstractExchange = await channel.get_exchange(
                    self.config.exchange
                )

                await asyncio.wait_for(
                    exchange.publish(
                        message=message,
                        routing_key=routing_key,
                        mandatory=True,
                    ),
                    timeout=confirmation_timeout,
                )

                logger.debug(f"Message {message_id} published successfully")
                return True

        except DeliveryError as e:
            logger.warning(f"Delivery error for message {message_id}: {e}")
            return False

        except Exception as e:
            logger.error(f"Failed to publish message {message_id}: {e}")
            return False
