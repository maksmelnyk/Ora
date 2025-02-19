using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Events;

namespace Learning.Infrastructure.Telemetry;

public static class Extensions
{
    public static void ConfigureSerilog(this ConfigureHostBuilder hostBuilder, TelemetryOptions telemetryOptions)
    {
        hostBuilder.UseSerilog((context, services, serilogConfig) =>
        {
            serilogConfig.ReadFrom.Configuration(context.Configuration)
                .ReadFrom.Services(services)
                .Enrich.FromLogContext()
                .Enrich.WithProperty("service_name", telemetryOptions.ServiceName)
                .WriteTo.Console(restrictedToMinimumLevel: LogEventLevel.Information);

            if (!string.IsNullOrWhiteSpace(telemetryOptions.LogFilePath))
            {
                serilogConfig.WriteTo.Logger(lc => lc
                    .Filter.ByExcluding(logEvent =>
                        logEvent.Properties.TryGetValue("SourceContext", out var sourceContext) &&
                        LogHelper.IsSystemLogCategory(sourceContext.ToString()) &&
                        logEvent.Level < LogEventLevel.Warning
                    )
                    .WriteTo.File(
                        formatter: new SnakeCaseLogJsonFormatter(),
                        path: telemetryOptions.LogFilePath,
                        rollingInterval: RollingInterval.Day,
                        fileSizeLimitBytes: telemetryOptions.LogFileSizeLimitBytes
                    )
                );
            }
        }, writeToProviders: true);
    }

    public static void AddTelemetry(this IServiceCollection services, TelemetryOptions options)
    {
        if (!options.OtelTelemetryEnabled())
            return;

        var otel = services.AddOpenTelemetry()
            .ConfigureResource(r => r.AddService(options.ServiceName));

        if (options.EnableOtelTraces)
        {
            otel.WithTracing(tracing =>
            {
                tracing.AddHttpClientInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddOtlpExporter(o =>
                    {
                        o.Endpoint = new Uri(options.OpenTelemetryEndpoint);
                        o.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.Grpc;
                        o.ExportProcessorType = OpenTelemetry.ExportProcessorType.Batch;
                    });
            });
        }

        if (options.EnableOtelMetrics)
        {
            otel.WithMetrics(metrics =>
            {
                metrics.AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddRuntimeInstrumentation()
                    .AddPrometheusExporter()
                    .AddOtlpExporter(o =>
                    {
                        o.Endpoint = new Uri(options.OpenTelemetryEndpoint);
                        o.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.Grpc;
                        o.ExportProcessorType = OpenTelemetry.ExportProcessorType.Batch;
                    });
            });
        }

        if (options.EnableOtelLogging)
        {
            otel.WithLogging(logging =>
            {
                logging.AddProcessor(new LogProcessor())
                    .AddOtlpExporter(o =>
                    {
                        o.Endpoint = new Uri(options.OpenTelemetryEndpoint);
                        o.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.Grpc;
                        o.ExportProcessorType = OpenTelemetry.ExportProcessorType.Batch;
                    });
            });
        }
    }
}