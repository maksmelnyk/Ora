using System.Globalization;
using FluentValidation;
using Learning.Exceptions;
using Learning.Features.Products.Contracts;
using Learning.Features.Products.Entities;
using Learning.Infrastructure.Identity;
using Learning.Infrastructure.Messaging;
using Learning.Infrastructure.Messaging.Events;
using Learning.Infrastructure.Messaging.RabbitMq.Publishers;

namespace Learning.Features.Products.Services;

public interface IProductWriteService
{
    Task<long> CreateProductAsync(ProductCreateRequest request, CancellationToken token);
    Task UpdateProductAsync(long productId, ProductUpdateRequest request, CancellationToken token);
    Task SetProductStatusAsync(long productId, CancellationToken token);
    Task DeleteProductAsync(long productId, CancellationToken token);
    Task SetProductScheduledAsync(long productId, string startTime, string endTime, CancellationToken token);
}

public class ProductWriteService(
    IProductRepository repo,
    ICurrentUser currentUser,
    IMessagePublisher publisher,
    ILogger<ProductWriteService> logger,
    IValidator<ProductCreateRequest> productCreateRequestValidator,
    IValidator<ProductUpdateRequest> productUpdateRequestValidator
    ) : IProductWriteService
{
    public async Task<long> CreateProductAsync(ProductCreateRequest request, CancellationToken token)
    {
        await productCreateRequestValidator.ValidateAndThrowAsync(request, token);

        var userId = currentUser.GetUserId();

        var product = ProductMapper.FromProductCreateRequest(request, userId);

        await repo.AddEntityAsync(product, token);

        await publisher.PublishAsync(
                Constants.EducatorProductCreatedKey,
                new EducatorProductCreatedEvent { UserId = userId.ToString() },
                token
            );

        return product.Id;
    }

    public async Task UpdateProductAsync(long productId, ProductUpdateRequest request, CancellationToken token)
    {
        await productUpdateRequestValidator.ValidateAndThrowAsync(request, token);

        var product = await repo.GetProductByIdAsync(productId, false, token)
            ?? throw new NotFoundException("Product not found", ErrorCode.ProductNotFound);

        if (product.EducatorId != currentUser.GetUserId())
            throw new ForbiddenException();

        if ((product.Type == ProductType.GroupSession || product.Type == ProductType.PrivateSession) && request.DurationMin < 0)
            throw new ArgumentException("DurationMin must be greater than 0");

        if ((product.Type == ProductType.GroupSession || product.Type == ProductType.OnlineCourse) && request.MaxParticipants < 0)
            throw new ArgumentException("MaxParticipants must be greater than 0");

        ProductMapper.MapToProduct(product, request);
        await repo.UpdateEntityAsync(product, token);
    }

    public async Task SetProductStatusAsync(long productId, CancellationToken token)
    {
        var product = await repo.GetProductByIdAsync(productId, false, token)
            ?? throw new NotFoundException("Product not found", ErrorCode.ProductNotFound);

        if (product.EducatorId != currentUser.GetUserId())
            throw new ForbiddenException();

        product.Status = product.Status == ProductStatus.Active ? ProductStatus.Inactive : ProductStatus.Active;
        await repo.UpdateEntityAsync(product, token);
    }

    public async Task DeleteProductAsync(long productId, CancellationToken token)
    {
        var product = await repo.GetProductByIdAsync(productId, false, token)
            ?? throw new NotFoundException("Product not found", ErrorCode.ProductNotFound);

        if (product.EducatorId != currentUser.GetUserId())
            throw new ForbiddenException();

        if (product.HasEnrollment)
            throw new UnprocessableEntityException("Product has active enrollment", ErrorCode.ProductHasActiveEnrollment);

        product.DeletedAt = DateTime.UtcNow;
        await repo.UpdateEntityAsync(product, token);
    }

    public async Task SetProductScheduledAsync(long productId, string startTime, string endTime, CancellationToken token)
    {
        var product = await repo.GetProductByIdAsync(productId, false, token);
        if (product == null)
        {
            logger.LogError("Product {product_id} not found", productId);
            return;
        }

        product.LastScheduledAt = DateTime.Parse(startTime, null, DateTimeStyles.RoundtripKind);
        if (product.OnlineCourseProduct != null)
        {
            product.OnlineCourseProduct.StartTime = product.LastScheduledAt;
            product.OnlineCourseProduct.EndTime = endTime == null ? null : DateTime.Parse(endTime, null, DateTimeStyles.RoundtripKind);
        }

        await repo.UpdateEntityAsync(product, token);
    }
}