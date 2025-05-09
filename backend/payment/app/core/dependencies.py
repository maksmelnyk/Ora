from functools import lru_cache

from httpx import AsyncClient

from app.core.config.settings import ExternalServiceSettings, Settings
from app.auth.jwks import JwksProvider
from app.auth.validator import TokenValidator


@lru_cache()
def get_settings() -> Settings:
    from app.core.config.settings import Settings

    return Settings()


def get_external_service_settings() -> ExternalServiceSettings:
    return get_settings().external_services


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
        audience=settings.keycloak.client_id,
        issuer=settings.keycloak.issuer_uri,
    )
