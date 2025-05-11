from typing import Any
from fastapi import Request
from app.infrastructure.messaging.publisher import Publisher


def get_publisher(request: Request) -> Publisher:
    manager: Any = request.app.state.rabbitmq_app_manager
    return manager.get_publisher()
