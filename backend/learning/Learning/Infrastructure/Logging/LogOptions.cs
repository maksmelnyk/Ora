namespace Learning.Infrastructure.Logging;

public class LogOptions
{
    public string ServiceName { get; set; } = "learning-service";
    public string LogFilePath { get; set; } = "logs/log.txt";
    public int LogFileSizeLimitBytes { get; set; } = 500 * 1024 * 1024;
}