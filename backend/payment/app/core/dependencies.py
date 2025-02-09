from functools import lru_cache

from app.core.config.settings import Settings
from app.auth.jwks import JwksProvider
from app.auth.validator import TokenValidator


@lru_cache()
def get_settings() -> Settings:
    from app.core.config.settings import Settings

    return Settings()


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
