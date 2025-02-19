import os

from typing import Any, Union


def get_env_var(name: str, default: Union[str, int, float, bool]) -> Any:
    value: str | None = os.getenv(name)

    if value is None:
        return default

    var_type = type(default)

    if var_type == bool:
        return value.lower() in ("true", "1", "t", "yes", "y")

    try:
        return var_type(value)
    except (ValueError, TypeError):
        return default


class AppSettings:
    port: str = get_env_var(name="PAYMENT_PORT", default="8086")
    host: str = get_env_var(name="PAYMENT_HOST", default="0.0.0.0")
    name: str = get_env_var(name="PAYMENT_NAME", default="payment-service")
    version: str = get_env_var(name="PAYMENT_VERSION", default="1.0.0")
    debug: bool = get_env_var(name="PAYMENT_DEBUG", default=False)


class DatabaseSettings:
    url: str = get_env_var(name="PAYMENT_DB_URL", default="")
    pool_size: int = get_env_var(name="PAYMENT_DB_POOL_SIZE", default=10)
    max_overflow: int = get_env_var(name="PAYMENT_DB_MAX_OVERFLOW", default=20)
    timeout: int = get_env_var(name="PAYMENT_DB_TIMEOUT", default=30)
    debug: bool = get_env_var(name="PAYMENT_DB_DEBUG", default=False)


class KeycloakSettings:
    jwks_uri: str = get_env_var(name="KEYCLOAK_JWKS_URI", default="")
    issuer_uri: str = get_env_var(name="KEYCLOAK_ISSUER_URI", default="")
    client_id: str = get_env_var(name="PAYMENT_KEYCLOAK_CLIENT_ID", default="")


class LogSettings:
    service_name: str = get_env_var(name="PAYMENT_NAME", default="payment-service")
    level: str = get_env_var(name="PAYMENT_LOG_LEVEL", default="INFO")
    file_dir: str = get_env_var(name="PAYMENT_LOG_FILE_DIR", default="logs")
    file_path: str = get_env_var(name="PAYMENT_LOG_FILE_PATH", default="logs.txt")
    file_rotation: int = get_env_var(
        name="PAYMENT_LOG_FILE_ROTATION", default=10 * 1024 * 1024
    )
    backup_count: int = get_env_var("PAYMENT_LOG_BACKUP_COUNT", default=5)


class TelemetrySettings:
    otel_endpoint: str = get_env_var(
        name="OTEL_GRPC_URL", default="http://localhost:4317"
    )
    enable_otel_tracing: str = get_env_var("PAYMENT_OTEL_TRACING", default=True)
    enable_otel_metrics: str = get_env_var("PAYMENT_OTEL_METRICS", default=True)
    enable_otel_logging: str = get_env_var("PAYMENT_OTEL_LOGGING", default=True)


class Settings:
    app: AppSettings = AppSettings()
    db: DatabaseSettings = DatabaseSettings()
    keycloak: KeycloakSettings = KeycloakSettings()
    log: LogSettings = LogSettings()
    telemetry: TelemetrySettings = TelemetrySettings()


settings = Settings()
