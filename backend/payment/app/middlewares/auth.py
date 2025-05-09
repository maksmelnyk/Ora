import uuid

from http import HTTPStatus
from loguru import logger
from typing import Any, Dict
from fastapi import Request, Response
from starlette.types import ASGIApp
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.auth.validator import TokenValidator
from app.exceptions.app_exception import AppHttpException
from app.exceptions.error_codes import ErrorCode
from app.exceptions.exception_handlers import error_json_response


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app: ASGIApp,
        validator: TokenValidator,
    ) -> None:
        super().__init__(app=app)
        self.validator: TokenValidator = validator

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:

        # TODO: temporary allow OpenAPI docs APIs
        public_apis: list[str] = ["/docs", "/openapi.json"]
        if request.url.path in public_apis:
            return await call_next(request)

        try:
            token: str | None = request.headers.get("Authorization")
            if not token or not token.startswith("Bearer "):
                return error_json_response(
                    message="Invalid token",
                    error_code=ErrorCode.ERROR_TOKEN_INVALID,
                    status_code=HTTPStatus.UNAUTHORIZED,
                )

            token = token.split(sep="Bearer ")[1]
            payload: Dict[str, Any] = await self.validator.validate_token(token=token)

            user_id: Any | None = payload.get("sub")
            if user_id == None:
                return error_json_response(
                    message="Invalid token: user id not found",
                    error_code=ErrorCode.ERROR_TOKEN_INVALID,
                    status_code=HTTPStatus.UNAUTHORIZED,
                )

            request.state.user_id = uuid.UUID(hex=user_id)
        except AppHttpException as ae:
            logger.error(f"Error occurred: {ae.error_code} / {ae.message}")
            return error_json_response(
                message=ae.message, error_code=ae.error_code, status_code=ae.status_code
            )
        except Exception as e:
            logger.exception("Unexpected error: {error}", error=str(object=e))
            raise e

        return await call_next(request)
