using OpenTelemetry;
using OpenTelemetry.Logs;

namespace Learning.Infrastructure.Telemetry;

public class LogProcessor : BaseProcessor<LogRecord>
{
    public override void OnEnd(LogRecord data)
    {
        if (LogHelper.IsSystemLogCategory(data.CategoryName) && data.LogLevel < LogLevel.Warning)
            return;

        var updatedAttributes = data.Attributes.Select(e => new KeyValuePair<string, object>(LogHelper.ToSnakeCase(e.Key), e.Value)).ToList();

        data.Attributes = updatedAttributes;

        base.OnEnd(data);
    }
}