import httpx
import logging

from datetime import datetime, timezone
from http import HTTPStatus
from typing import Optional, Dict, Any

from app.exceptions.app_exception import AppHttpException
from app.exceptions.error_codes import ErrorCode

logger: logging.Logger = logging.getLogger(name=__name__)


class JwksProvider:
    def __init__(self, jwks_uri: str, cache_expiry_seconds: int = 3600) -> None:
        self.jwks_uri: str = jwks_uri
        self.cache_expiry_seconds: int = cache_expiry_seconds
        self.keys: Optional[Dict[str, Any]] = None
        self.last_update: Optional[datetime] = None

    async def get_key(self, kid: str) -> str | Any:
        """Retrieve the public key by KID, refreshing keys if necessary."""
        if not self.keys or self.__keys_expired():
            await self.__fetch_public_keys()

        if self.keys is None:
            raise AppHttpException(
                status_code=HTTPStatus.UNAUTHORIZED,
                error_code=ErrorCode.ERROR_PUBLIC_KEY_FETCH,
                message="Public keys could not be fetched",
            )

        for key in self.keys.get("keys", []):
            if key.get("kid") == kid:
                return key

        raise AppHttpException(
            status_code=HTTPStatus.UNAUTHORIZED,
            error_code=ErrorCode.ERROR_AUTHORIZATION_FAILED,
            message="Invalid token: key not found",
        )

    async def __fetch_public_keys(self) -> None:
        """Fetch and cache public keys asynchronously from the JWKS URI."""
        try:
            logger.info(msg=f"Fetching JWKS from {self.jwks_uri}")
            async with httpx.AsyncClient() as client:
                response: httpx.Response = await client.get(url=self.jwks_uri)
                response.raise_for_status()
                self.keys = response.json()
                self.last_update = datetime.now(tz=timezone.utc)
        except Exception as e:
            logger.error(msg=f"Failed to fetch JWKS: {e}")
            raise AppHttpException(
                status_code=HTTPStatus.UNAUTHORIZED,
                error_code=ErrorCode.ERROR_PUBLIC_KEY_FETCH,
                message="Failed to fetch public keys",
            )

    def __keys_expired(self) -> bool:
        """Check if the cached keys are expired."""
        if not self.last_update:
            return True
        elapsed_time: float = (
            datetime.now(tz=timezone.utc) - self.last_update
        ).total_seconds()
        return elapsed_time > self.cache_expiry_seconds
