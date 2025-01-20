import logging
import uuid

from http import HTTPStatus
from typing import Any, Dict
from fastapi import Request, Response
from starlette.types import ASGIApp
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.auth.validator import TokenValidator
from app.exceptions.app_exception import AppHttpException
from app.exceptions.error_codes import ErrorCode
from app.exceptions.exception_handlers import error_json_response

logger: logging.Logger = logging.getLogger(name=__name__)


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp, validator: TokenValidator) -> None:
        super().__init__(app=app)
        self.validator: TokenValidator = validator

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        try:
            token: str | None = request.headers.get("Authorization")
            if not token or not token.startswith("Bearer "):
                raise AppHttpException(
                    status_code=HTTPStatus.UNAUTHORIZED,
                    error_code=ErrorCode.ERROR_TOKEN_INVALID,
                    message="Invalid token",
                )

            token = token.split(sep="Bearer ")[1]
            payload: Dict[str, Any] = await self.validator.validate_token(token=token)

            user_id: Any | None = payload.get("sub")
            if user_id == None:
                raise AppHttpException(
                    status_code=HTTPStatus.UNAUTHORIZED,
                    error_code=ErrorCode.ERROR_TOKEN_INVALID,
                    message="Invalid token: user id not found",
                )

            request.state.user_id = uuid.UUID(hex=user_id)
        except AppHttpException as ae:
            logging.error(msg=f"Error occurred: {ae.error_code}/{ae.message}")
            return error_json_response(
                message=ae.message, error_code=ae.error_code, status_code=ae.status_code
            )
        except Exception as e:
            logging.error(msg=f"Unexpected error occurred: {e}")
            raise e

        return await call_next(request)
