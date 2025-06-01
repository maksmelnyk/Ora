using Learning.Features.Products.Entities;

namespace Learning.Features.Products.Contracts;

public record ProductCreateRequest(
    ProductType Type,
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
    int? MaxParticipants,
    ModuleCreateRequest[] Modules
);

public record ModuleCreateRequest(string Title, string Description, int SortOrder, LessonCreateRequest[] Lessons);

public record LessonCreateRequest(string Title, string Description, int SortOrder, int DurationMin);
