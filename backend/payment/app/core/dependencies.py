from functools import lru_cache

from app.core.config import Settings
from app.auth.jwks import JwksProvider
from app.auth.validator import TokenValidator


@lru_cache()
def get_settings() -> Settings:
    from app.core.config import Settings

    return Settings()


def get_jwks_provider(
    settings: Settings = get_settings(),
) -> JwksProvider:
    return JwksProvider(jwks_uri=settings.keycloak.KEYCLOAK_JWKS_URI)


def get_token_validator(
    settings: Settings = get_settings(),
    jwks_provider: JwksProvider = get_jwks_provider(),
) -> TokenValidator:
    return TokenValidator(
        jwks_provider=jwks_provider,
        audience=settings.keycloak.KEYCLOAK_CLIENT_ID,
        issuer=settings.keycloak.KEYCLOAK_ISSUER_URI,
    )
