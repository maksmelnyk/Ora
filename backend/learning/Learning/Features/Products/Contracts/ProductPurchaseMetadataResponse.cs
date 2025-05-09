namespace Learning.Features.Products.Contracts;

public record ProductPurchaseMetadataResponse(
    bool CanPurchase,
    bool SchedulingRequired = false,
    decimal Price = 0,
    long? ExpectedScheduledEventId = null,
    long[] ExpectedScheduledLessonIds = null,
    string ErrorMessage = null
)
{
    public static ProductPurchaseMetadataResponse Error(string errorMessage) => new(false, ErrorMessage: errorMessage);
    public static ProductPurchaseMetadataResponse Success(
        decimal price,
        bool schedulingRequired = false,
        long? expectedScheduledEventId = null,
        long[] expectedScheduledLessonIds = null
    ) => new(true, schedulingRequired, price, expectedScheduledEventId, expectedScheduledLessonIds);
}
