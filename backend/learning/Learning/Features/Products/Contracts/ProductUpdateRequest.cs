using Learning.Features.Products.Entities;

namespace Learning.Features.Products.Contracts;

public record ProductUpdateRequest(
    ProductLevel Level,
    long SubCategoryId,
    string Title,
    string Objectives,
    string Description,
    string Highlights,
    string Audience,
    string Requirements,
    string Language,
    string ImageUrl,
    string VideoUrl,
    decimal Price,
    int? DurationMin,
    int? MaxParticipants
);

public record ModuleUpdateRequest(string Title, string Description, int SortOrder);

public record LessonUpdateRequest(string Title, string Description, int SortOrder, int DurationMin);
