import logging

from http import HTTPStatus
from typing import Optional, Any, Sequence, cast
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.exceptions.app_exception import AppHttpException, AppException
from app.exceptions.error_codes import map_error_code_to_status, ErrorCode

logger: logging.Logger = logging.getLogger(name=__name__)


def error_json_response(
    message: str,
    error_code: str,
    status_code: Optional[int] = None,
    details: Optional[Sequence[Any]] = None,
) -> JSONResponse:
    sc: int = (
        status_code if status_code else map_error_code_to_status(error_code=error_code)
    )
    return JSONResponse(
        status_code=sc,
        content={
            "status_code": status_code,
            "error": {"message": message, "code": error_code, "details": details},
        },
    )


async def app_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all custom app exceptions"""
    e: AppException = cast(AppException, exc)
    logger.error(msg=f"App exception occurred - {e.error_code} / {e.message}")
    return error_json_response(message=e.message, error_code=e.error_code)


async def validation_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Handle all validation exceptions"""
    e: RequestValidationError = cast(RequestValidationError, exc)
    details = str(object=e.errors())
    return error_json_response(
        status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
        message="Validation error",
        error_code=ErrorCode.ERROR_MODEL_VALIDATION,
        details=details,
    )


async def app_http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all custom app http exceptions"""
    e: AppHttpException = cast(AppHttpException, exc)
    logger.error(msg=f"App exception occurred - {e.error_code} / {e.message}")
    return error_json_response(
        status_code=e.status_code,
        message=e.message,
        error_code=e.error_code,
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all unhandled exceptions"""
    return error_json_response(
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        message="Internal server error",
        error_code=ErrorCode.ERROR_INTERNAL_SERVER,
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
        exc_class_or_status_code=AppHttpException, handler=app_http_exception_handler
    )
    app.add_exception_handler(
        exc_class_or_status_code=Exception, handler=global_exception_handler
    )
