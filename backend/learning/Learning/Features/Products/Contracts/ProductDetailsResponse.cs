using Learning.Features.Products.Entities;
using Learning.Features.Profiles;

namespace Learning.Features.Products.Contracts;

public record ProductDetailsResponse(
    long Id,
    long SubCategoryId,
    ProductType Type,
    ProductStatus Status,
    ProductLevel Level,
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
    double Rating,
    int RatingCount,
    int? DurationMin,
    int? MaxParticipants,
    DateTime? StartDate,
    DateTime? EndDate,
    EducatorResponse Educator,
    ModuleResponse[] Modules
);

public record ModuleResponse(long Id, string Title, string Description, int SortOrder, LessonResponse[] Lessons);

public record LessonResponse(long Id, string Title, string Description, int SortOrder, int DurationMin);