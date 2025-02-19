from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter


def setup_tracing(resource: Resource, otlp_endpoint: str) -> None:
    """Configures OpenTelemetry tracing with OTLP export."""

    trace_provider = TracerProvider(resource=resource)
    trace_provider.add_span_processor(
        span_processor=BatchSpanProcessor(
            span_exporter=OTLPSpanExporter(endpoint=otlp_endpoint)
        )
    )

    trace.set_tracer_provider(tracer_provider=trace_provider)
