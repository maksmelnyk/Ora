import uuid
import time

from jose import jwt
from typing import Optional, Dict, Any
from loguru import logger
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response


def get_user_id_from_token(auth_header: Optional[str]) -> Optional[str]:
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    try:
        token: str = auth_header.split(" ")[1]
        payload: Dict[str, Any] = jwt.decode(
            token=token, key="", options={"verify_signature": False}
        )
        return payload.get("sub")
    except Exception:
        return None


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        auth_header: str | None = request.headers.get("Authorization")
        start_time: float = time.time()

        with logger.contextualize(
            request_id=str(object=uuid.uuid4()),
            http_method=request.method,
            http_path=request.url.path,
            http_query=request.url.query,
            client_ip=request.client.host if request.client else "anonymous",
            user_id=get_user_id_from_token(auth_header=auth_header),
        ):

            duration: float = time.time() - start_time

            response: Response = await call_next(request)

            log_data: Dict[str, Any] = {
                "status_code": response.status_code,
                "duration_ms": duration,
            }

            if response.status_code >= 500:
                logger.error("Request completed with server error", extra=log_data)
            elif response.status_code >= 400:
                logger.warning("Request completed with user error", extra=log_data)
            else:
                logger.info("Request completed successfully", extra=log_data)

            return response
