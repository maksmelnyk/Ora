from abc import ABC, abstractmethod
from typing import Any, Dict, List

from aio_pika.abc import AbstractIncomingMessage


class Consumer(ABC):
    """Base class for message consumers."""

    @property
    @abstractmethod
    def queue_name(self) -> str:
        """Queue name to consume from."""
        pass

    @property
    @abstractmethod
    def routing_patterns(self) -> List[str]:
        """Routing patterns to bind to."""
        return []

    @abstractmethod
    async def handle_message(
        self,
        message_body: str,
        headers: Dict[str, Any],
        message: AbstractIncomingMessage,
    ) -> bool:
        """
        Handle an incoming message.

        Args:
            message_body: Raw message body as string
            headers: Message headers
            message: Original aio_pika message object

        Returns:
            bool: True if the message was processed successfully, False to reject
        """
        pass
