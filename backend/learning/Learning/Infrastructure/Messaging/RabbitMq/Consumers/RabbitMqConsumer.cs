using System.Text.Json;
using Learning.Features.Enrollments;
using Learning.Features.Products.Services;
using Learning.Features.Profiles;
using Learning.Features.Profiles.Entities;
using Learning.Infrastructure.Messaging.Events;

namespace Learning.Infrastructure.Messaging.RabbitMq.Consumers;

public class RabbitMqConsumer(ILogger<RabbitMqConsumer> logger, IServiceScopeFactory serviceScopeFactory) : IMessageConsumer
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public string QueueName => Constants.LearningQueueName;
    public string[] RoutingPatterns =>
    [
        Constants.PaymentToLearningPattern,
        Constants.ProfileToLearningPattern,
        Constants.SchedulingToLearningPattern
    ];

    public async Task<bool> HandleAsync(string message, IDictionary<string, object> headers, CancellationToken token)
    {
        try
        {
            var messageId = RabbitMqUtils.GetHeaderStringValue(headers, "message_id");
            var eventType = RabbitMqUtils.GetHeaderStringValue(headers, "__TypeId__", null);
            if (string.IsNullOrEmpty(eventType))
            {
                logger.LogWarning("Received message with no event type header");
                return false;
            }

            using var scope = serviceScopeFactory.CreateScope();

            return eventType switch
            {
                Constants.EducatorProfileUpdated =>
                    await HandleEducatorProfileUpdatedEvent(scope.ServiceProvider, message, messageId, token),

                Constants.EventScheduled =>
                    await HandleEventScheduledEvent(scope.ServiceProvider, message, messageId, token),

                Constants.PaymentCompleted =>
                    await HandlePaymentCompletedEvent(scope.ServiceProvider, message, messageId, token),

                Constants.BookingCompleted =>
                    await HandleBookingCompletedEvent(scope.ServiceProvider, message, messageId, token),

                _ => HandleUnknownEventType(eventType, message)
            };
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Failed to deserialize message: {message}", message);
            return false;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing message: {message}", message);
            return false;
        }
    }

    private async Task<bool> HandleEducatorProfileUpdatedEvent(
        IServiceProvider serviceProvider,
        string message,
        string messageId,
        CancellationToken token)
    {
        try
        {
            var eventObj = JsonSerializer.Deserialize<EducatorProfileUpdatedEvent>(message, SerializerOptions)
                ?? throw new JsonException($"Failed to deserialize {nameof(EducatorProfileUpdatedEvent)} for message {messageId}");

            var profileService = serviceProvider.GetRequiredService<IProfileService>();
            await profileService.UpdateProfileAsync(new ProfileSummary
            {
                UserId = Guid.Parse(eventObj.UserId),
                FirstName = eventObj.FirstName,
                LastName = eventObj.LastName,
                ImageUrl = eventObj.ImageUrl
            }, token);
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error handling {name} for message {message_id}", nameof(PaymentCompletedEvent), messageId);
            throw;
        }
    }

    private async Task<bool> HandleEventScheduledEvent(
        IServiceProvider serviceProvider,
        string message,
        string messageId,
        CancellationToken token)
    {
        try
        {
            var eventObj = JsonSerializer.Deserialize<EventScheduledEvent>(message, SerializerOptions)
                ?? throw new JsonException($"Failed to deserialize {nameof(EventScheduledEvent)} for message {messageId}");

            var productService = serviceProvider.GetRequiredService<IProductWriteService>();
            await productService.SetProductScheduledAsync(eventObj.ProductId, eventObj.StartTime, eventObj.EndTime, token);
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error handling {name} for message {message_id}", nameof(EventScheduledEvent), messageId);
            throw;
        }
    }

    private async Task<bool> HandlePaymentCompletedEvent(
        IServiceProvider serviceProvider,
        string message,
        string messageId,
        CancellationToken token)
    {
        try
        {
            var eventObj = JsonSerializer.Deserialize<PaymentCompletedEvent>(message, SerializerOptions)
                ?? throw new JsonException($"Failed to deserialize {nameof(PaymentCompletedEvent)} for message {messageId}");

            var enrollmentService = serviceProvider.GetRequiredService<IEnrollmentService>();
            var userId = Guid.Parse(eventObj.UserId);
            await enrollmentService.AddEnrollmentAsync(userId, eventObj.ProductId, eventObj.ScheduledEventId, token);
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error handling {name} for message {message_id}", nameof(PaymentCompletedEvent), messageId);
            throw;
        }
    }

    private async Task<bool> HandleBookingCompletedEvent(
        IServiceProvider serviceProvider,
        string message,
        string messageId,
        CancellationToken token)
    {
        try
        {
            var eventObj = JsonSerializer.Deserialize<BookingCompletedEvent>(message, SerializerOptions)
                ?? throw new JsonException($"Failed to deserialize {nameof(BookingCompletedEvent)} for message {messageId}");

            var enrollmentService = serviceProvider.GetRequiredService<IEnrollmentService>();
            var userId = Guid.Parse(eventObj.UserId);
            await enrollmentService.CompleteEnrollment(userId, eventObj.EnrollmentId, token);
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error handling {name} for message {message_id}", nameof(BookingCompletedEvent), messageId);
            throw;
        }
    }

    private bool HandleUnknownEventType(string eventType, string message)
    {
        logger.LogWarning("Received unsupported event type: {eventType}, message: {message}", eventType, message);
        return false;
    }
}
