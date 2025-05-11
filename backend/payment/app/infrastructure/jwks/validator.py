from loguru import logger
from http import HTTPStatus
from jose import jwt, JWTError
from jose.constants import ALGORITHMS
from typing import Dict, Any

from app.exceptions.app_exception import AppHttpException
from app.exceptions.error_codes import ErrorCode
from app.infrastructure.jwks.jwks import JwksProvider


class TokenValidator:
    def __init__(self, jwks_provider: JwksProvider, audience: str, issuer: str) -> None:
        self.jwks_provider: JwksProvider = jwks_provider
        self.audience: str = audience
        self.issuer: str = issuer

    async def validate_token(self, token: str) -> Dict[str, Any]:
        """Validate the JWT using the public key."""
        try:
            header: Dict[str, Any] = jwt.get_unverified_header(token=token)
            kid: Any = header["kid"]

            key: str | Any = await self.jwks_provider.get_key(kid=kid)

            payload: Dict[str, Any] = jwt.decode(
                token=token,
                key=key,
                algorithms=[ALGORITHMS.RS256],
                audience=self.audience,
                issuer=self.issuer,
            )
            return payload
        except JWTError as e:
            logger.exception("Token validation error: {error}", error=str(object=e))
            raise AppHttpException(
                status_code=HTTPStatus.UNAUTHORIZED,
                error_code=ErrorCode.ERROR_TOKEN_INVALID,
                message="Invalid token",
            )
