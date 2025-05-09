import asyncio
from loguru import logger
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional

import aio_pika
from aio_pika.abc import AbstractChannel, AbstractConnection
from aio_pika.pool import Pool

from app.core.config.settings import RabbitMqSettings


class RabbitMqConnectionProvider:
    """Provides and manages RabbitMQ connections with connection pooling."""

    def __init__(self, config: RabbitMqSettings) -> None:
        self.config: RabbitMqSettings = config
        self._connection_pool: Optional[Pool[AbstractConnection]] = None
        self._channel_pool: Optional[Pool[AbstractChannel]] = None
        self._init_lock = asyncio.Lock()

    async def initialize(self) -> None:
        """Initialize the connection and channel pools."""
        async with self._init_lock:
            if self._connection_pool is not None:
                return

            logger.info("Initializing RabbitMQ connection provider")

            self._connection_pool = Pool(
                constructor=self._create_connection,
                max_size=self.config.concurrent_consumers + 5,
                loop=asyncio.get_event_loop(),
            )

            self._channel_pool = Pool(
                constructor=self._create_channel,
                max_size=(self.config.concurrent_consumers * self.config.prefetch_count)
                + 10,
                loop=asyncio.get_event_loop(),
            )

    async def _create_connection(self) -> AbstractConnection:
        max_retries: int = self.config.retry_count
        retry_delay: float = self.config.initial_retry_interval_ms / 1000

        for attempt in range(1, max_retries + 2):
            try:
                connection: AbstractConnection = await aio_pika.connect_robust(
                    host=self.config.host,
                    port=self.config.port,
                    login=self.config.username,
                    password=self.config.password,
                    virtualhost=self.config.virtual_host,
                    client_properties={
                        "connection_name": f"payment-service@{self._get_hostname()}"
                    },
                )

                logger.info("Connected to RabbitMQ")
                return connection

            except Exception as e:
                if attempt > max_retries:
                    logger.error(
                        f"Failed to connect to RabbitMQ after {max_retries} attempts: {e}"
                    )
                    raise

                jitter: float = 0.8 + (0.4 * (asyncio.get_event_loop().time() % 1))
                delay: float = min(
                    retry_delay
                    * (self.config.retry_multiplier ** (attempt - 1))
                    * jitter,
                    self.config.max_retry_interval_ms / 1000,
                )

                logger.warning(
                    f"Attempt {attempt} failed. Retrying in {delay:.2f}s: {e}"
                )
                await asyncio.sleep(delay=delay)

        raise RuntimeError("Unreachable: failed to connect after retries")

    async def _create_channel(self) -> AbstractChannel:
        """Get a connection from the pool and create a channel."""
        if self._connection_pool is None:
            await self.initialize()

        assert self._connection_pool is not None

        async with self._connection_pool.acquire() as connection:
            channel: AbstractChannel = await connection.channel(publisher_confirms=True)
            await channel.set_qos(prefetch_count=self.config.prefetch_count)
            return channel

    def _on_connection_lost(self, connection: AbstractConnection) -> None:
        """Handle connection lost events."""
        logger.warning("RabbitMQ connection lost")

    def _on_reconnect(self, connection: AbstractConnection) -> None:
        """Handle reconnection events."""
        logger.info("Reconnected to RabbitMQ")

    def _get_hostname(self) -> str:
        """Get the hostname for connection identification."""
        import socket

        return socket.gethostname()

    @asynccontextmanager
    async def acquire_channel(self) -> AsyncGenerator[AbstractChannel, None]:
        """Get a channel from the pool."""
        if self._channel_pool is None:
            await self.initialize()

        assert self._channel_pool is not None

        async with self._channel_pool.acquire() as channel:
            yield channel

    async def close(self) -> None:
        """Close all connections and channels."""
        logger.info("Closing RabbitMQ connections")
        if self._channel_pool:
            await self._channel_pool.close()
            self._channel_pool = None

        if self._connection_pool:
            await self._connection_pool.close()
            self._connection_pool = None
