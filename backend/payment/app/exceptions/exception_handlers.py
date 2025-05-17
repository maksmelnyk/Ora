from http import HTTPStatus
from loguru import logger
from typing import Optional, Any, Sequence, cast
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.exceptions.app_exception import (
    AppHTTPException,
    AppException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
)
from app.exceptions.error_codes import ErrorCode


def error_json_response(
    message: str,
    error_code: str,
    status_code: int,
    details: Optional[Sequence[Any]] = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "status_code": status_code,
            "error": {"message": message, "code": error_code, "details": details},
        },
    )


async def app_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all custom app exceptions"""
    e: AppException = cast(AppException, exc)

    if isinstance(exc, UnauthorizedException):
        status_code = HTTPStatus.UNAUTHORIZED
    elif isinstance(exc, NotFoundException):
        status_code = HTTPStatus.NOT_FOUND
    elif isinstance(exc, UnprocessableEntityException):
        status_code = HTTPStatus.UNPROCESSABLE_ENTITY
    else:
        status_code = HTTPStatus.INTERNAL_SERVER_ERROR

    return error_json_response(
        status_code=status_code, message=e.message, error_code=e.code
    )


async def validation_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Handle all validation exceptions"""
    e: RequestValidationError = cast(RequestValidationError, exc)
    details = str(object=e.errors())
    return error_json_response(
        status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
        message="Validation error",
        error_code=ErrorCode.MODEL_VALIDATION,
        details=details,
    )


async def app_http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all custom app http exceptions"""
    e: AppHTTPException = cast(AppHTTPException, exc)
    return error_json_response(
        status_code=e.status_code,
        message=e.message,
        error_code=e.code,
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all unhandled exceptions"""
    logger.exception("Unhandled exception: {error}", error=str(object=exc))
    return error_json_response(
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        message="Internal server error",
        error_code=ErrorCode.INTERNAL_SERVER_ERROR,
    )


def setup_exception_handlers(app: FastAPI) -> None:
    """Configure all exception handlers for the FastAPI app"""
    app.add_exception_handler(
        exc_class_or_status_code=AppException, handler=app_exception_handler
    )
    app.add_exception_handler(
        exc_class_or_status_code=RequestValidationError,
        handler=validation_exception_handler,
    )
    app.add_exception_handler(
        exc_class_or_status_code=AppHTTPException, handler=app_http_exception_handler
    )
    app.add_exception_handler(
        exc_class_or_status_code=Exception, handler=global_exception_handler
    )
