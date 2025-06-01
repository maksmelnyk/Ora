using Learning.Features.Products.Entities;
using Learning.Features.Profiles;

namespace Learning.Features.Products.Contracts;

public record ProductSummaryResponse(
    long Id,
    long SubCategoryId,
    Guid EducatorId,
    ProductType Type,
    ProductStatus Status,
    ProductLevel Level,
    string Title,
    string Description,
    string Language,
    string ImageUrl,
    decimal Price,
    int? DurationMin,
    int? MaxParticipants,
    DateTime? StartDate,
    DateTime? EndDate,
    EducatorResponse Educator
);
