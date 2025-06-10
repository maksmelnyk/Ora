using Learning.Exceptions;
using Learning.Features.Enrollments;
using Learning.Features.Products.Contracts;
using Learning.Features.Products.Entities;
using Learning.Features.Profiles;
using Learning.Infrastructure.Identity;
using Learning.Shared.Pagination;

namespace Learning.Features.Products.Services;

public interface IProductReadService
{
    Task<PagedResult<ProductSummaryResponse>> GetProductsAsync(
        ProductFilter filter,
        int skip,
        int take,
        CancellationToken token
    );

    Task<CursorPagedResult<ProductSummaryResponse>> GetEducatorProductsAsync(
        Guid educatorId,
        string cursor,
        int pageSize,
        CancellationToken token
    );

    Task<CursorPagedResult<ProductSummaryResponse>> GetEnrolledProductsAsync(
        string cursor,
        int pageSize,
        CancellationToken token
    );

    Task<ProductDetailsResponse> GetProductDetailsAsync(long id, CancellationToken token);

    Task<ProductPurchaseMetadataResponse> GetProductPurchaseMetadataAsync(
        long productId,
        ProductPurchaseMetadataRequest request,
        CancellationToken token
    );

    Task<ProductSchedulingMetadataResponse> GetProductSchedulingMetadataAsync(
        long productId,
        ProductSchedulingMetadataRequest request,
        CancellationToken token
    );
}

public sealed class ProductReadService(
    ICurrentUser currentUser,
    IProductRepository productRepository,
    IEnrollmentRepository enrollmentRepository,
    IProfileService profileService
    ) : IProductReadService
{
    private static readonly Random random = new();

    public async Task<PagedResult<ProductSummaryResponse>> GetProductsAsync(
        ProductFilter filter,
        int pageNumber,
        int pageSize,
        CancellationToken token
    )
    {
        var userId = currentUser.GetUserIdOrNull();

        var (Items, TotalItems) = await productRepository.GetProductsAsync(
            userId == null || userId != filter?.EducatorId,
            filter,
            (pageNumber - 1) * pageSize,
            pageSize,
            token
        );
        if (Items.Length == 0)
            return new PagedResult<ProductSummaryResponse>();

        var profiles = await profileService.GetEducatorsAsync(Items.Select(e => e.EducatorId).Distinct(), token);

        var result = Items.Select(e =>
        {
            var educator = profiles.GetValueOrDefault(e.EducatorId, new EducatorResponse(e.EducatorId, default, default, default));
            //TODO: replace random with real data
            return ProductMapper.ToProductSummary(e, educator, random);
        }).ToArray();

        return new PagedResult<ProductSummaryResponse>(result, TotalItems, pageNumber, pageSize);
    }

    public async Task<CursorPagedResult<ProductSummaryResponse>> GetEducatorProductsAsync(
        Guid educatorId,
        string cursor,
        int pageSize,
        CancellationToken token
    )
    {
        var userId = currentUser.GetUserIdOrNull();

        var products = await productRepository.GetEducatorProductsAsync(
            userId == null || userId != educatorId,
            educatorId,
            cursor != null ? long.Parse(cursor) : null,
            pageSize,
            token
        );
        if (products.Length == 0)
            return new CursorPagedResult<ProductSummaryResponse>();

        var educator = await profileService.GetEducatorByIdAsync(educatorId, token) ?? new EducatorResponse(educatorId, default, default, default);

        //TODO: replace random with real data
        var result = products.Select(e => ProductMapper.ToProductSummary(e, educator, random)).ToArray();

        var nextCursor = result.Length < pageSize ? null : result[^1].Id.ToString();

        return new CursorPagedResult<ProductSummaryResponse>(result, nextCursor, pageSize);
    }

    public async Task<CursorPagedResult<ProductSummaryResponse>> GetEnrolledProductsAsync(
        string cursor,
        int pageSize,
        CancellationToken token
    )
    {
        var userId = currentUser.GetUserId();

        var parsedCursor = cursor != null ? long.Parse(cursor) : (long?)null;

        var products = await productRepository.GetEnrolledProductsAsync(userId, parsedCursor, pageSize, token);
        if (products.Length == 0)
            return new CursorPagedResult<ProductSummaryResponse>();

        var profiles = await profileService.GetEducatorsAsync(products.Select(e => e.EducatorId).Distinct(), token);

        var result = products.Select(e =>
        {
            var educator = profiles.GetValueOrDefault(e.EducatorId, new EducatorResponse(e.EducatorId, default, default, default));

            //TODO: replace random with real data
            return ProductMapper.ToProductSummary(e, educator, random);
        }).ToArray();

        var nextCursor = result.Length < pageSize ? null : result[^1].Id.ToString();

        return new CursorPagedResult<ProductSummaryResponse>(result, nextCursor, pageSize);
    }

    public async Task<ProductDetailsResponse> GetProductDetailsAsync(long id, CancellationToken token)
    {
        var product = await productRepository.GetProductByIdAsync(id, true, token);
        if (product is null)
            return null;

        var profiles = await profileService.GetEducatorsAsync([product.EducatorId], token);

        var educator = profiles.GetValueOrDefault(product.EducatorId, new EducatorResponse(product.EducatorId, default, default, default));

        //TODO: replace random with real data
        var result = ProductMapper.ToProductDetails(product, educator, random);
        return result;
    }

    public async Task<ProductPurchaseMetadataResponse> GetProductPurchaseMetadataAsync(
        long productId,
        ProductPurchaseMetadataRequest request,
        CancellationToken token
    )
    {
        ArgumentNullException.ThrowIfNull(request);

        var userId = currentUser.GetUserId();

        var product = await productRepository.GetProductByIdAsync(productId, false, token)
            ?? throw new NotFoundException("Product not found", ErrorCode.ProductNotFound);

        if (product.Type == ProductType.PrivateSession)
            return ProductPurchaseMetadataResponse.Success(product.Price);

        if (product.Type == ProductType.GroupSession && request.ScheduledEventId is null or 0)
            return ProductPurchaseMetadataResponse.Error("Schedule event is required for group sessions");

        if (await enrollmentRepository.EnrolmentExistsAsync(userId, productId, request.ScheduledEventId, token))
            return ProductPurchaseMetadataResponse.Error("User already enrolled in this product");

        if (product.Type == ProductType.PreRecordedCourse)
            return ProductPurchaseMetadataResponse.Success(product.Price);

        var enrollmentCount = await enrollmentRepository.GetProductEnrollmentsCountAsync(productId, request.ScheduledEventId, token);
        if (enrollmentCount >= (product.OnlineCourseProduct?.MaxParticipants ?? product.GroupSessionProduct?.MaxParticipants))
            return ProductPurchaseMetadataResponse.Error("Product enrollment limit reached");

        if (product.Type == ProductType.OnlineCourse)
        {
            var lessonIds = await productRepository.GetProductLessonIds(productId, token);
            if (lessonIds.Length == 0)
                return ProductPurchaseMetadataResponse.Error("No lessons found for this course");

            return ProductPurchaseMetadataResponse.Success(product.Price, true, null, lessonIds);
        }

        return ProductPurchaseMetadataResponse.Success(product.Price, true, request.ScheduledEventId);
    }

    public async Task<ProductSchedulingMetadataResponse> GetProductSchedulingMetadataAsync(
        long productId,
        ProductSchedulingMetadataRequest request,
        CancellationToken token
    )
    {
        ArgumentNullException.ThrowIfNull(request);

        var product = await productRepository.GetProductByIdAsync(productId, true, token)
            ?? throw new NotFoundException("Product not found", ErrorCode.ProductNotFound);

        if (product.EducatorId != currentUser.GetUserId())
            return new ProductSchedulingMetadataResponse(ProductSchedulingState.Invalid, ErrorMessage: "Invalid access to product");

        if (product.Type is ProductType.PrivateSession or ProductType.PreRecordedCourse)
            return new ProductSchedulingMetadataResponse(ProductSchedulingState.Unschedulable);

        if (product.Type is ProductType.GroupSession && request.DurationMin != product.GroupSessionProduct.DurationMin)
            return new ProductSchedulingMetadataResponse(ProductSchedulingState.Invalid, ErrorMessage: "Wrong duration");

        if (product.Type is not ProductType.OnlineCourse)
            return new ProductSchedulingMetadataResponse(
                ProductSchedulingState.Valid,
                product.Title,
                product.GroupSessionProduct?.MaxParticipants ?? product.OnlineCourseProduct?.MaxParticipants ?? 0
            );

        if (request.LessonId is null or 0)
            return new ProductSchedulingMetadataResponse(ProductSchedulingState.Invalid, ErrorMessage: "Lesson is required for online courses");

        var productLesson = product.Modules.SelectMany(e => e.Lessons).FirstOrDefault(e => e.Id == request.LessonId);
        if (productLesson is null)
            return new ProductSchedulingMetadataResponse(ProductSchedulingState.Invalid, ErrorMessage: "Lesson not found");

        if (request.DurationMin != productLesson.DurationMin)
            return new ProductSchedulingMetadataResponse(ProductSchedulingState.Invalid, ErrorMessage: "Wrong duration");

        return new ProductSchedulingMetadataResponse(
            ProductSchedulingState.Valid,
            product.Title,
            product.GroupSessionProduct?.MaxParticipants ?? product.OnlineCourseProduct?.MaxParticipants ?? 0
        );
    }
}
