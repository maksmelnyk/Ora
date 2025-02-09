import os


class AppConfig:
    PORT: str = os.getenv("PAYMENT_PORT", default="8086")
    HOST: str = os.getenv("PAYMENT_HOST", default="0.0.0.0")
    NAME: str = os.getenv("PAYMENT_NAME", default="payment-service")
    VERSION: str = os.getenv("PAYMENT_VERSION", default="1.0.0")
    DEBUG: bool = os.getenv("PAYMENT_DEBUG", default="false").lower() in (
        "true",
        "1",
        "t",
    )


class DatabaseConfig:
    URL: str = os.getenv("PAYMENT_DB_URL", default="")
    POOL_SIZE: int = int(os.getenv("PAYMENT_DB_POOL_SIZE", default="10"))
    MAX_OVERFLOW: int = int(os.getenv("PAYMENT_DB_MAX_OVERFLOW", default="20"))
    TIMEOUT: int = int(os.getenv("PAYMENT_DB_TIMEOUT", default="30"))
    DEBUG: bool = os.getenv("PAYMENT_DB_DEBUG", default="false").lower() in (
        "true",
        "1",
        "t",
    )


class KeycloakConfig:
    KEYCLOAK_JWKS_URI: str = os.getenv("KEYCLOAK_JWKS_URI", default="")
    KEYCLOAK_ISSUER_URI: str = os.getenv("KEYCLOAK_ISSUER_URI", default="")
    KEYCLOAK_CLIENT_ID: str = os.getenv("PAYMENT_KEYCLOAK_CLIENT_ID", default="")


class LogConfig:
    SERVICE_NAME: str = os.getenv("PAYMENT_NAME", default="payment-service")
    LEVEL: str = os.getenv("PAYMENT_LOG_LEVEL", default="INFO")
    FILE_DIR: str = os.getenv("PAYMENT_LOG_FILE_DIR", default="logs")
    FILE_PATH: str = os.getenv("PAYMENT_LOG_FILE_PATH", default="logs.txt")
    FILE_ROTATION: str = os.getenv("PAYMENT_LOG_FILE_ROTATION", default="500 MB")
    FILE_RETENTION: str = os.getenv("PAYMENT_LOG_FILE_RETENTION", default="7 days")
    FILE_COMPRESSION: str = os.getenv("PAYMENT_LOG_FILE_COMPRESSION", default="zip")


class Settings:
    app: AppConfig = AppConfig()
    db: DatabaseConfig = DatabaseConfig()
    keycloak: KeycloakConfig = KeycloakConfig()
    log: LogConfig = LogConfig()
