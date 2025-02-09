using Serilog.Events;
using Serilog.Formatting;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace Learning.Infrastructure.Logging;

public class SnakeCaseLogJsonFormatter : ITextFormatter
{
    private static readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        PropertyNamingPolicy = new SnakeCaseNamingPolicy(),
        WriteIndented = false,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    private static readonly HashSet<string> IgnoreProperties = ["MessageTemplate", "RequestPath", "RequestId"];

    private static readonly Dictionary<LogEventLevel, string> LogLevelMap = new()
    {
        { LogEventLevel.Debug, "DEBUG" },
        { LogEventLevel.Information, "INFO" },
        { LogEventLevel.Warning, "WARN" },
        { LogEventLevel.Error, "ERROR" },
        { LogEventLevel.Fatal, "FATAL" }
    };

    public void Format(LogEvent logEvent, TextWriter output)
    {
        var properties = new Dictionary<string, object>
        {
            { "timestamp", logEvent.Timestamp.UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ") },
            { "level", LogLevelMap[logEvent.Level] },
            { "message", logEvent.RenderMessage() }
        };

        if (logEvent.Exception != null)
        {
            properties.Add("exception", logEvent.Exception.ToString());
        }

        foreach (var prop in logEvent.Properties.Where(e => !IgnoreProperties.Contains(e.Key)))
        {
            var key = new SnakeCaseNamingPolicy().ConvertName(prop.Key);

            var value = prop.Value?.ToString().Trim('"');

            properties[key] = value;
        }

        var json = JsonSerializer.Serialize(properties, jsonSerializerOptions);
        output.WriteLine(json);
    }
}

public class SnakeCaseNamingPolicy : JsonNamingPolicy
{
    public override string ConvertName(string name)
    {
        if (string.IsNullOrEmpty(name)) return name;

        var result = new System.Text.StringBuilder();
        result.Append(char.ToLowerInvariant(name[0]));

        for (int i = 1; i < name.Length; i++)
        {
            if (char.IsUpper(name[i]))
            {
                result.Append('_');
                result.Append(char.ToLowerInvariant(name[i]));
            }
            else
            {
                result.Append(name[i]);
            }
        }

        return result.ToString();
    }
}