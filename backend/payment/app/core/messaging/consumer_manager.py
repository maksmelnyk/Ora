import asyncio
import random
from typing import Any, Dict, List, Optional

from aio_pika.abc import AbstractIncomingMessage, AbstractQueue
from loguru import logger

from app.core.config.settings import RabbitMqSettings
from app.core.messaging.connection_provider import RabbitMqConnectionProvider
from app.core.messaging.consumers.consumer import Consumer


class ConsumerManager:
    """Manages message consumers."""

    def __init__(
        self, connection_provider: RabbitMqConnectionProvider, config: RabbitMqSettings
    ) -> None:
        self.connection_provider: RabbitMqConnectionProvider = connection_provider
        self.config: RabbitMqSettings = config
        self.consumers: List[Consumer] = []
        self._consumer_tasks: List[asyncio.Task[Any]] = []

    def register_consumer(self, consumer: Consumer) -> None:
        """Register a message consumer."""
        self.consumers.append(consumer)

    async def start_consumers(self) -> None:
        """Start all registered consumers."""
        logger.info("Starting RabbitMQ consumers")

        for consumer in self.consumers:
            task: asyncio.Task[Any] = asyncio.create_task(
                self._run_consumer(consumer=consumer)
            )
            self._consumer_tasks.append(task)

    async def stop_consumers(self) -> None:
        """Stop all consumers."""
        logger.info("Stopping RabbitMQ consumers...")
        if not self._consumer_tasks:
            logger.debug("No consumer tasks running.")
            return

        for task in self._consumer_tasks:
            task.cancel()
            logger.debug(f"Cancelled task: {task.get_name()}")

        await asyncio.gather(*self._consumer_tasks, return_exceptions=True)
        logger.debug("All consumer tasks stopped.")
        self._consumer_tasks.clear()

    async def _run_consumer(self, consumer: Consumer) -> None:
        """Run a single consumer."""
        queue_name: str = consumer.queue_name
        logger.debug(f"Attempting to start consumer for queue: {queue_name}")

        try:
            async with self.connection_provider.acquire_channel() as channel:
                logger.debug(f"Channel acquired for consumer: {queue_name}")
                queue: AbstractQueue = await channel.get_queue(queue_name)
                logger.debug(f"Queue '{queue_name}' obtained by consumer.")

                async def _on_message(message: AbstractIncomingMessage) -> None:
                    async with message.process(requeue=False):
                        await self._process_message(consumer=consumer, message=message)

                consumer_tag = await queue.consume(callback=_on_message, no_ack=False)  # type: ignore
                logger.info(
                    f"Started consuming from queue '{queue_name}' with consumer tag: {consumer_tag}"
                )

                while True:
                    await asyncio.sleep(delay=1)

        except asyncio.CancelledError:
            logger.info(f"Consumer for queue {consumer.queue_name} was cancelled")
        except Exception as e:
            logger.error(f"Error in consumer {consumer.queue_name}: {e}")

    async def _process_message(
        self, consumer: Consumer, message: AbstractIncomingMessage
    ) -> None:
        """Process a single message with retry logic."""
        message_body: str = message.body.decode()
        message_headers: Dict[str, Any] = message.headers  # type: ignore
        headers: Dict[str, Any] = message_headers or {}
        message_id: str = message.message_id or "unknown"
        delivery_tag: Optional[int] = message.delivery_tag

        event_type: Any = headers.get("__TypeId__", "unknown")
        correlation_id: Any = headers.get("correlation_id", "unknown")

        logger.debug(
            f"Processing message: id={message_id}, delivery_tag={delivery_tag}, queue={consumer.queue_name}, type={event_type}, correlationId={correlation_id}"
        )

        retry_count = 0
        max_retries: int = self.config.retry_count
        delay: float = self.config.initial_retry_interval_ms / 1000

        while retry_count <= max_retries:
            try:
                success: bool = await consumer.handle_message(
                    message_body=message_body, headers=headers, message=message
                )

                if success:
                    logger.debug(f"Successfully processed message: {message_id}")
                    return
                else:
                    logger.warning(f"Handler rejected message {message_id}")
                    await message.nack(requeue=False)
                    return

            except Exception as e:
                retry_count += 1

                if retry_count > max_retries:
                    logger.error(
                        f"Failed to process message {message_id} after {retry_count} retries: {e}"
                    )
                    raise

                jitter: float = 0.8 + (0.4 * random.random())
                current_delay: float = min(
                    delay
                    * (self.config.retry_multiplier ** (retry_count - 1))
                    * jitter,
                    self.config.max_retry_interval_ms / 1000,
                )

                logger.warning(
                    f"Error processing message (attempt {retry_count}/{max_retries}). "
                    f"Retrying in {current_delay:.2f}s: {e}"
                )

                await asyncio.sleep(delay=current_delay)
