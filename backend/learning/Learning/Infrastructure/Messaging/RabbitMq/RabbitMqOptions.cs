namespace Learning.Infrastructure.Messaging.RabbitMq;

public class RabbitMqOptions
{
    public string HostName { get; set; }
    public int Port { get; set; }
    public string VirtualHost { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    public string Exchange { get; set; }
    public string DeadLetterExchange { get; set; }
    public int MessageTtl { get; set; }

    public int RetryCount { get; set; } = 3;
    public int InitialRetryIntervalMs { get; set; } = 1000;
    public int MaxRetryIntervalMs { get; set; } = 10000;
    public double RetryMultiplier { get; set; } = 2.0;
    public ushort PrefetchCount { get; set; } = 10;
    public int PublisherConfirmTimeoutMs { get; set; } = 5000;
    public ushort ConcurrentConsumers { get; set; } = 3;
    public int MaxOutstandingConfirms { get; set; } = 128;
}