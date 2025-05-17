from typing import Any
from fastapi import Request
from uuid import UUID

from app.exceptions.app_exception import UnauthorizedException
from app.exceptions.error_codes import ErrorCode


class CurrentUser:
    def __init__(self, user_id: UUID) -> None:
        self.id: UUID = user_id


def get_current_user(request: Request) -> CurrentUser:
    user_id: Any | None = getattr(request.state, "user_id", None)
    if user_id is None:
        raise UnauthorizedException(message="Unauthorized", code=ErrorCode.UNAUTHORIZED)
    return CurrentUser(user_id=user_id)
