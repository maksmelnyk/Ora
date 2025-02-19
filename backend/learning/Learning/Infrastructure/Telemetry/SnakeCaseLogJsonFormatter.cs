using Serilog.Events;
using Serilog.Formatting;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace Learning.Infrastructure.Telemetry;

public class SnakeCaseLogJsonFormatter : ITextFormatter
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonSnakeCaseNamingPolicy.Instance,
        WriteIndented = false,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    public void Format(LogEvent logEvent, TextWriter output)
    {
        var properties = new Dictionary<string, object>
        {
            { "timestamp", logEvent.Timestamp.UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") },
            { "level", LogHelper.LogLevelMap[logEvent.Level] },
            { "message", logEvent.RenderMessage() }
        };

        if (logEvent.Exception != null)
        {
            properties.Add("exception", logEvent.Exception.ToString());
        }

        foreach (var prop in logEvent.Properties.Where(e => !LogHelper.IgnoreLogProperties.Contains(e.Key)))
        {
            var key = LogHelper.ToSnakeCase(prop.Key);
            properties[key] = prop.Value?.ToString().Trim('"');
        }

        var json = JsonSerializer.Serialize(properties, JsonOptions);

        output.WriteLine(json);
    }
}
