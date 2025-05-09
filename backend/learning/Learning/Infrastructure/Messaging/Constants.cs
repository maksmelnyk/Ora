namespace Learning.Infrastructure.Messaging;

public static class Constants
{
    // Queue names
    public const string LearningQueueName = "learning-events-queue";
    public const string LearningDlqName = "learning-events-dlq";
    public const string LearningDlqRoutingKey = "dlq.learning";

    // Routing patterns
    public const string PaymentToLearningPattern = "payment.to.learning.#";
    public const string SchedulingToLearningPattern = "scheduling.to.learning.#";
    public const string ProfileToLearningPattern = "profile.to.learning.#";

    // Routing keys
    public const string EducatorProductCreatedKey = "learning.to.profile.product.created";

    // Event types
    public const string EducatorProductCreated = "EDUCATOR_PRODUCT_CREATED";
    public const string EducatorProfileUpdated = "EDUCATOR_PROFILE_UPDATED";
    public const string PaymentCompleted = "PAYMENT_COMPLETED";
    public const string EventScheduled = "EVENT_SCHEDULED";
    public const string BookingCompleted = "BOOKING_COMPLETED";
}