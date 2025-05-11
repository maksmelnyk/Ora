from typing import Any, List, Optional
from loguru import logger

from app.config.settings import RabbitMqSettings
from app.infrastructure.messaging.connection_provider import RabbitMqConnectionProvider
from app.infrastructure.messaging.consumer_manager import ConsumerManager
from app.infrastructure.messaging.consumers.consumer import Consumer
from app.infrastructure.messaging.consumers.dlq_consumer import DeadLetterQueueConsumer
from app.infrastructure.messaging.exchange_manager import ExchangeManager
from app.infrastructure.messaging.publisher import Publisher


class RabbitMqApplicationManager:
    """
    Manages the lifecycle and components of the RabbitMQ integration
    for the application.
    """

    def __init__(self, config: RabbitMqSettings) -> None:
        self._config: RabbitMqSettings = config
        self._connection_provider: Optional[RabbitMqConnectionProvider] = None
        self._exchange_manager: Optional[ExchangeManager] = None
        self._publisher: Optional[Publisher] = None
        self._consumer_manager: Optional[ConsumerManager] = None
        self._consumers: List[Consumer] = []

        # Store references to services/dependencies that consumers will need
        # self._learning_event_service: Optional[LearningEventProcessingService] = None

    async def startup(
        self,
        # Accept dependencies that consumers will need during startup
        # Example: learning_event_service: LearningEventProcessingService,
        **consumer_dependencies: Any,
    ) -> None:
        """Initializes all RabbitMQ components and starts consumers."""
        logger.info("Starting RabbitMQ components initialization...")

        try:
            self._connection_provider = RabbitMqConnectionProvider(config=self._config)
            await self._connection_provider.initialize()
            logger.info("RabbitMQ Connection Provider initialized.")

            self._exchange_manager = ExchangeManager(
                connection_provider=self._connection_provider, config=self._config
            )
            await self._exchange_manager.initialize()
            logger.info("RabbitMQ Exchange Manager initialized (topology declared).")

            self._publisher = Publisher(
                connection_provider=self._connection_provider, config=self._config
            )
            logger.info("RabbitMQ Publisher initialized.")

            self._consumer_manager = ConsumerManager(
                connection_provider=self._connection_provider, config=self._config
            )
            logger.info("RabbitMQ Consumer Manager initialized.")

            # # Create and Register Consumers (INJECT DEPENDENCIES HERE)
            # payment_consumer = PaymentEventsConsumer(...)

            dlq_consumer = DeadLetterQueueConsumer()

            self._consumers.extend([dlq_consumer])
            for consumer in self._consumers:
                self._consumer_manager.register_consumer(consumer=consumer)
                logger.info(f"Registered consumer for queue: {consumer.queue_name}")

            await self._consumer_manager.start_consumers()
            logger.info("RabbitMQ Consumers started.")

        except Exception as e:
            logger.error(
                f"Failed to initialize RabbitMQ components: {e}", exc_info=True
            )
            raise

    async def shutdown(self) -> None:
        """Shuts down all RabbitMQ components."""
        logger.info("Starting RabbitMQ components shutdown...")

        if self._consumer_manager:
            await self._consumer_manager.stop_consumers()
            logger.info("RabbitMQ Consumers stopped.")

        if self._connection_provider:
            await self._connection_provider.close()
            logger.info("RabbitMQ Connection Provider closed.")

        logger.info("RabbitMQ components shutdown complete.")

    def get_publisher(self) -> Publisher:
        """Provides the Publisher instance for dependency injection."""
        if self._publisher is None:
            raise RuntimeError("RabbitMQ Publisher is not initialized.")
        return self._publisher
