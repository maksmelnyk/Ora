namespace Learning.Infrastructure.Telemetry;

public class TelemetryOptions
{
    public string OpenTelemetryEndpoint { get; set; } = "http://localhost:4317";
    public bool EnableOtelTraces { get; set; } = true;
    public bool EnableOtelMetrics { get; set; } = true;
    public bool EnableOtelLogging { get; set; } = true;
    public string ServiceName { get; set; } = "learning-service";
    public string LogFilePath { get; set; } = "logs/log.txt";
    public int LogFileSizeLimitBytes { get; set; } = 10 * 1024 * 1024;

    public bool OtelTelemetryEnabled()
    {
        return EnableOtelLogging || EnableOtelMetrics || EnableOtelTraces;
    }
}