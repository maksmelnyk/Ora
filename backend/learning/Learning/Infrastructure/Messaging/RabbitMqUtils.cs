namespace Learning.Infrastructure.Messaging;

public static class RabbitMqUtils
{
    public static string GetHeaderStringValue(IDictionary<string, object> headersDict, string key, string defaultValue = "unknown", ILogger logger = null)
    {
        if (headersDict.TryGetValue(key, out var value) && value is byte[] byteValue)
        {
            try
            {
                return System.Text.Encoding.UTF8.GetString(byteValue);
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Failed to decode header {key} as UTF-8 string.", key);
                return defaultValue;
            }
        }
        return defaultValue;
    }
}