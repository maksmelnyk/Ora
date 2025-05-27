from functools import lru_cache

from httpx import AsyncClient

from app.config.settings import Settings, get_settings
from app.infrastructure.jwks.jwks import JwksProvider
from app.infrastructure.jwks.validator import TokenValidator


@lru_cache
def get_http_client() -> AsyncClient:
    client = AsyncClient()
    client.timeout = 10
    return client


def get_jwks_provider(
    settings: Settings = get_settings(),
) -> JwksProvider:
    return JwksProvider(jwks_uri=settings.keycloak.jwks_uri)


def get_token_validator(
    settings: Settings = get_settings(),
    jwks_provider: JwksProvider = get_jwks_provider(),
) -> TokenValidator:
    return TokenValidator(
        jwks_provider=jwks_provider,
        audience=settings.keycloak.audience,
        issuer=settings.keycloak.issuer_uri,
    )
