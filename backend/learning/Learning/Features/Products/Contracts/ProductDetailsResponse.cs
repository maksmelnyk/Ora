using Learning.Data.Entities;
using Learning.Features.Profiles;

namespace Learning.Features.Products.Contracts;

public record ProductDetailsResponse(
    long Id,
    long SubCategoryId,
    ProductType Type,
    ProductStatus Status,
    string Title,
    string Description,
    string ImageUrl,
    decimal Price,
    int? DurationMin,
    int? MaxParticipants,
    DateTime? StartDate,
    DateTime? EndDate,
    EducatorResponse Educator,
    ModuleResponse[] Modules
);

public record ModuleResponse(long Id, string Title, string Description, int SortOrder, LessonResponse[] Lessons);

public record LessonResponse(long Id, string Title, string Description, int SortOrder, int DurationMin);