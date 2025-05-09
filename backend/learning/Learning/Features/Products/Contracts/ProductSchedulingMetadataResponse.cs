namespace Learning.Features.Products.Contracts;

public record ProductSchedulingMetadataResponse(
    string State,
    string Title = null,
    int MaxParticipants = 0,
    string ErrorMessage = null
);

public static class ProductSchedulingState
{
    public static string Unschedulable { get; set; } = "UNSCHEDULABLE";
    public static string Valid { get; set; } = "VALID";
    public static string Invalid { get; set; } = "INVALID";
}