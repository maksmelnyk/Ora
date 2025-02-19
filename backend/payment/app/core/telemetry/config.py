from opentelemetry.sdk.resources import Resource

from app.core.config.settings import Settings
from app.core.telemetry.tracing import setup_tracing
from app.core.telemetry.metrics import setup_metrics
from app.core.telemetry.logging import setup_logging


def configure_telemetry(stg: Settings) -> None:
    """Configure Tracing, Metrics, and Logging."""
    resource: Resource = Resource.create(
        attributes={"service.name": stg.log.service_name}
    )

    setup_logging(
        resource=resource, stg=stg.log, otel_endpoint=stg.telemetry.otel_endpoint
    )

    if stg.telemetry.enable_otel_tracing:
        setup_tracing(resource=resource, otlp_endpoint=stg.telemetry.otel_endpoint)

    if stg.telemetry.enable_otel_metrics:
        setup_metrics(resource=resource, otlp_endpoint=stg.telemetry.otel_endpoint)
