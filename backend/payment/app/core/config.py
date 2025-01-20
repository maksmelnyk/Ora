import os


class AppConfig:
    PORT: str = os.getenv("PAYMENT_PORT", default="8086")
    NAME: str = os.getenv("PAYMENT_NAME", default="Payment Service")
    VERSION: str = os.getenv("PAYMENT_VERSION", default="1.0.0")
    DEBUG: bool = os.getenv("PAYMENT_DEBUG", default="false").lower() in ("true", "1", "t")


class DatabaseConfig:
    DATABASE_URL: str = os.getenv("PAYMENT_DB_URL", default="")
    DEBUG: bool = os.getenv("PAYMENT_DEBUG", default="false").lower() in ("true", "1", "t")


class KeycloakConfig:
    KEYCLOAK_JWKS_URI: str = os.getenv("KEYCLOAK_JWKS_URI", default="")
    KEYCLOAK_ISSUER_URI: str = os.getenv("KEYCLOAK_ISSUER_URI", default="")
    KEYCLOAK_CLIENT_ID: str = os.getenv("KEYCLOAK_PAYMENT_CLIENT_ID", default="")


class Settings:
    app: AppConfig = AppConfig()
    db: DatabaseConfig = DatabaseConfig()
    keycloak: KeycloakConfig = KeycloakConfig()
