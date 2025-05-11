from opentelemetry import metrics
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter


def setup_metrics(resource: Resource, otlp_endpoint: str) -> None:
    """Configures OpenTelemetry metrics with OTLP export."""

    metric_reader = PeriodicExportingMetricReader(
        exporter=OTLPMetricExporter(endpoint=otlp_endpoint)
    )
    meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])

    metrics.set_meter_provider(meter_provider=meter_provider)
