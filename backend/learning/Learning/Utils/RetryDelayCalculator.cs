namespace Learning.Utils;

public static class RetryDelayCalculator
{
    [ThreadStatic]
    private static Random _random;

    private static Random Instance => _random ??= new Random();

    public static int Calculate(int attempt, int initialIntervalMs, double multiplier, int maxIntervalMs)
    {
        var jitter = 0.8 + Instance.NextDouble() * 0.4;
        var delay = (int)(initialIntervalMs * Math.Pow(multiplier, attempt - 1) * jitter);
        return Math.Min(delay, maxIntervalMs);
    }
}