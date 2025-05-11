from typing import Dict, Any

import aio_pika
from aio_pika.abc import AbstractChannel, AbstractExchange, AbstractQueue
from loguru import logger

from app.config.settings import RabbitMqSettings
from app.infrastructure.messaging.connection_provider import RabbitMqConnectionProvider
from app.infrastructure.messaging.constants import RabbitMqConstants


class ExchangeManager:
    """Manages RabbitMQ exchanges and queues"""

    def __init__(
        self, connection_provider: RabbitMqConnectionProvider, config: RabbitMqSettings
    ) -> None:
        self.connection_provider: RabbitMqConnectionProvider = connection_provider
        self.config: RabbitMqSettings = config
        self.exchanges: Dict[Any, Any] = {}

    async def initialize(self) -> None:
        """Initialize exchanges and queues."""

        async with self.connection_provider.acquire_channel() as channel:
            main_exchange: AbstractExchange = await self._declare_exchange(
                channel=channel,
                name=self.config.exchange,
                type=aio_pika.ExchangeType.TOPIC,
            )

            dlq_exchange: AbstractExchange = await self._declare_exchange(
                channel=channel,
                name=self.config.dead_letter_exchange,
                type=aio_pika.ExchangeType.TOPIC,
            )

            self.exchanges = {"main": main_exchange, "dlq": dlq_exchange}

            await self._setup_payment_queue(channel=channel)

    async def _declare_exchange(
        self, channel: AbstractChannel, name: str, type: aio_pika.ExchangeType
    ) -> AbstractExchange:
        """Declare an exchange."""
        exchange: AbstractExchange = await channel.declare_exchange(  # type: ignore
            name=name, type=type, durable=True
        )
        return exchange

    async def _setup_payment_queue(self, channel: AbstractChannel) -> None:
        """Setup payment queue with its bindings."""

        queue: AbstractQueue = await channel.declare_queue(  # type: ignore
            name=RabbitMqConstants.PAYMENT_QUEUE_NAME,
            durable=True,
            arguments={
                "x-dead-letter-exchange": self.config.dead_letter_exchange,
                "x-dead-letter-routing-key": RabbitMqConstants.PAYMENT_DLQ_ROUTING_KEY,
                "x-message-ttl": self.config.message_ttl,
            },
        )
        logger.debug(f"Queue {RabbitMqConstants.PAYMENT_QUEUE_NAME} declared.")

        await queue.bind(  # type: ignore
            exchange=self.config.exchange,
            routing_key=RabbitMqConstants.LEARNING_TO_PAYMENT_PATTERN,
        )
        logger.debug(
            f"Queue {RabbitMqConstants.PAYMENT_QUEUE_NAME} bound to {self.config.exchange} with pattern {RabbitMqConstants.LEARNING_TO_PAYMENT_PATTERN}"
        )

        dlq: AbstractQueue = await channel.declare_queue(  # type: ignore
            name=RabbitMqConstants.PAYMENT_DLQ_NAME, durable=True
        )
        logger.debug(f"DLQ {RabbitMqConstants.PAYMENT_DLQ_NAME} declared.")

        await dlq.bind(  # type: ignore
            exchange=self.config.dead_letter_exchange,
            routing_key=RabbitMqConstants.PAYMENT_DLQ_ROUTING_KEY,
        )
        logger.debug(
            f"DLQ {RabbitMqConstants.PAYMENT_DLQ_NAME} bound to {self.config.dead_letter_exchange} with key {RabbitMqConstants.PAYMENT_DLQ_ROUTING_KEY}"
        )
