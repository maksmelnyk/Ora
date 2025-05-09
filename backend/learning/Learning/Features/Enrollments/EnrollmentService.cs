using Learning.Data.Entities;
using Learning.Features.Enrollments.Contracts;
using Learning.Features.Products;
using Learning.Infrastructure.Identity;

namespace Learning.Features.Enrollments;

public interface IEnrollmentService
{
    Task<long[]> GetMyEnrolledProductIds(EnrolledProductsRequest request, CancellationToken token);
    Task<EnrollmentBookingMetadataResponse> GetEnrollmentBookingMetadataAsync(
        long id,
        EnrollmentBookingMetadataRequest request,
        CancellationToken token
    );
    Task AddEnrollmentAsync(Guid userId, long productId, long? scheduledEventId, CancellationToken token);
    Task CompleteEnrollment(Guid userId, long id, CancellationToken token);
}

public class EnrollmentService(
    ICurrentUser currentUser,
    IEnrollmentRepository enrollmentRepository,
    IProductRepository productRepository,
    ILogger<EnrollmentService> logger
) : IEnrollmentService
{
    public Task<long[]> GetMyEnrolledProductIds(EnrolledProductsRequest request, CancellationToken token)
    {
        if (request == null || request.Ids == null || request.Ids.Length == 0)
            return Task.FromResult(Array.Empty<long>()); ;

        return enrollmentRepository.GetEnrolledProductIdsAsync(currentUser.GetUserId(), request.Ids, token);
    }

    public async Task<EnrollmentBookingMetadataResponse> GetEnrollmentBookingMetadataAsync(
        long id,
        EnrollmentBookingMetadataRequest request,
        CancellationToken token
    )
    {
        var enrollment = await enrollmentRepository.GetUserEnrollmentByIdAsync(currentUser.GetUserId(), id, token);
        if (enrollment is null)
            return new EnrollmentBookingMetadataResponse(ErrorMessage: "Enrollment not found");

        var product = await productRepository.GetProductByIdAsync(enrollment.ProductId, false, token);
        if (product?.PrivateSessionProduct == null)
            return new EnrollmentBookingMetadataResponse(ErrorMessage: "Product not found");

        if (product.Type != ProductType.PrivateSession)
            return new EnrollmentBookingMetadataResponse(ErrorMessage: "Invalid product type");

        if (product.PrivateSessionProduct.DurationMin != request.DurationMin)
            return new EnrollmentBookingMetadataResponse(ErrorMessage: "Invalid duration");

        return new EnrollmentBookingMetadataResponse(
            true,
            null,
            product.EducatorId.ToString(),
            product.Id,
            product.Title
        );
    }

    public async Task AddEnrollmentAsync(Guid userId, long productId, long? scheduledEventId, CancellationToken token)
    {
        var product = await productRepository.GetProductByIdAsync(productId, false, token);
        if (product is null)
        {
            logger.LogError("Product {product_id} not found", productId);
            return;
        }

        if (product.Type == ProductType.OnlineCourse || product.Type == ProductType.PreRecordedCourse)
        {
            if (await enrollmentRepository.EnrolmentExistsAsync(userId, productId, scheduledEventId, token))
            {
                logger.LogWarning("Enrollment for product {product_id} already exists for user {user_id}", productId, userId);
                return;
            }
        }

        var enrollment = new Enrollment
        {
            UserId = userId,
            ProductId = productId,
            ScheduledEventId = scheduledEventId,
            CreatedAt = DateTime.UtcNow,
            Status = product.Type == ProductType.PrivateSession ? EnrollmentStatus.Completed : EnrollmentStatus.Active
        };

        await enrollmentRepository.AddEnrollmentAsync(enrollment, token);
        await productRepository.SetProductHasEnrollmentAsync(productId, token);
    }

    public async Task CompleteEnrollment(Guid userId, long id, CancellationToken token)
    {
        var enrollment = await enrollmentRepository.GetUserEnrollmentByIdAsync(userId, id, token);
        if (enrollment is null)
        {
            logger.LogError("Enrollment{id} not found for user {user_id}", id, userId);
            return;
        }

        if (enrollment.Status == EnrollmentStatus.Completed)
        {
            logger.LogWarning("Enrollment{id} already completed for user {user_id}", id, userId);
            return;
        }

        enrollment.Status = EnrollmentStatus.Completed;
        await enrollmentRepository.UpdateEnrollmentAsync(enrollment, token);
    }
}