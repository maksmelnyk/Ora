namespace Learning.Features.Products.Contracts;

public record ProductUpdateRequest(
    long SubCategoryId,
    string Title,
    string Description,
    string ImageUrl,
    decimal Price,
    int? DurationMin,
    int? MaxParticipants
);

public record ModuleUpdateRequest(string Title, string Description, int SortOrder);

public record LessonUpdateRequest(string Title, string Description, int SortOrder, int DurationMin);
