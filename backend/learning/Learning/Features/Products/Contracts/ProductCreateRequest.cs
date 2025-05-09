using Learning.Data.Entities;

namespace Learning.Features.Products.Contracts;

public record ProductCreateRequest(
    ProductType Type,
    long SubCategoryId,
    string Title,
    string Description,
    string ImageUrl,
    decimal Price,
    int? DurationMin,
    int? MaxParticipants,
    ModuleCreateRequest[] Modules
);

public record ModuleCreateRequest(string Title, string Description, int SortOrder, LessonCreateRequest[] Lessons);

public record LessonCreateRequest(string Title, string Description, int SortOrder, int DurationMin);
