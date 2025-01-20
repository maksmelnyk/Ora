import uuid
import time
import logging
import traceback

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response


logger: logging.Logger = logging.getLogger(name=__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = str(object=uuid.uuid4())
        request.state.request_id = request_id

        logger.info(
            "Incoming request",
            extra={
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "client_ip": request.client.host if request.client else None,
            },
        )

        start_time: float = time.time()
        
        try:
            response: Response = await call_next(request)
            process_time: float = time.time() - start_time
            logger.info(
                msg="Request completed",
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "processing_time": process_time,
                },
            )
            
        except Exception as exc:
            process_time: float = time.time() - start_time
            logger.error(
                msg="Request failed",
                extra={
                    "request_id": request_id,
                    "processing_time": process_time,
                    "error": str(object=exc),
                    "error_type": exc.__class__.__name__,
                    "traceback": traceback.format_exc(),
                },
            )
            raise

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = str(object=process_time)
        
        return response
