using System.Text.Json;

namespace Learning.Infrastructure.Telemetry;

public sealed class JsonSnakeCaseNamingPolicy : JsonNamingPolicy
{
    private static readonly Lazy<JsonSnakeCaseNamingPolicy> LazyInstance =
        new(() => new JsonSnakeCaseNamingPolicy());

    public static JsonSnakeCaseNamingPolicy Instance => LazyInstance.Value;

    private JsonSnakeCaseNamingPolicy() { }

    public override string ConvertName(string name)
    {
        if (string.IsNullOrEmpty(name)) return name;

        return LogHelper.ToSnakeCase(name);
    }
}