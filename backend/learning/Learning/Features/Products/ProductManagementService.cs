using System.Globalization;
using FluentValidation;
using Learning.Data.Entities;
using Learning.Exceptions;
using Learning.Features.Products.Contracts;
using Learning.Infrastructure.Identity;
using Learning.Infrastructure.Messaging;
using Learning.Infrastructure.Messaging.Events;
using Learning.Infrastructure.Messaging.RabbitMq.Publishers;

namespace Learning.Features.Products
{
    public interface IProductManagementService
    {
        Task<long> CreateProductAsync(ProductCreateRequest request, CancellationToken token);
        Task UpdateProductAsync(long productId, ProductUpdateRequest request, CancellationToken token);
        Task SetProductStatusAsync(long productId, CancellationToken token);
        Task DeleteProductAsync(long productId, CancellationToken token);
        Task<long> CreateModuleAsync(long productId, ModuleCreateRequest request, CancellationToken token);
        Task UpdateModuleAsync(long productId, long moduleId, ModuleUpdateRequest request, CancellationToken token);
        Task DeleteModuleAsync(long productId, long moduleId, CancellationToken token);
        Task<long> CreateLessonAsync(long productId, long moduleId, LessonCreateRequest request, CancellationToken token);
        Task UpdateLessonAsync(long productId, long moduleId, long lessonId, LessonUpdateRequest request, CancellationToken token);
        Task DeleteLessonAsync(long productId, long moduleId, long lessonId, CancellationToken token);
        Task SetProductScheduledAsync(long productId, string startTime, string endTime, CancellationToken token);
    }

    public class ProductManagementService(
        IProductRepository repo,
        ICurrentUser currentUser,
        IMessagePublisher publisher,
        ILogger<ProductManagementService> logger,
        IValidator<ProductCreateRequest> productCreateRequestValidator,
        IValidator<ProductUpdateRequest> productUpdateRequestValidator,
        IValidator<ModuleCreateRequest> moduleCreateRequestValidator,
        IValidator<ModuleUpdateRequest> moduleUpdateRequestValidator,
        IValidator<LessonCreateRequest> lessonCreateRequestValidator,
        IValidator<LessonUpdateRequest> lessonUpdateRequestValidator
        ) : IProductManagementService
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

            var product = await repo.GetProductByIdAsync(productId, false, token) ?? throw new ResourceNotFoundException();
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
            var product = await repo.GetProductByIdAsync(productId, false, token) ?? throw new ResourceNotFoundException();

            if (product.EducatorId != currentUser.GetUserId())
                throw new ForbiddenException();

            product.Status = product.Status == ProductStatus.Active ? ProductStatus.Inactive : ProductStatus.Active;
            await repo.UpdateEntityAsync(product, token);
        }

        public async Task DeleteProductAsync(long productId, CancellationToken token)
        {
            var product = await repo.GetProductByIdAsync(productId, false, token) ?? throw new ResourceNotFoundException();
            if (product.EducatorId != currentUser.GetUserId())
                throw new ForbiddenException();

            if (product.HasEnrollment)
                throw new InvalidOperationException("Cannot delete a product with active enrollments");

            product.DeletedAt = DateTime.UtcNow;
            await repo.UpdateEntityAsync(product, token);
        }

        public async Task<long> CreateModuleAsync(long productId, ModuleCreateRequest request, CancellationToken token)
        {
            await moduleCreateRequestValidator.ValidateAndThrowAsync(request, token);

            if (!await repo.ProductExistsAsync(productId, currentUser.GetUserId(), token))
                throw new ResourceNotFoundException();

            var module = ProductMapper.FromModuleCreateRequest(request);
            await repo.AddEntityAsync(module, token);

            return module.Id;
        }

        public async Task UpdateModuleAsync(long productId, long moduleId, ModuleUpdateRequest request, CancellationToken token)
        {
            await moduleUpdateRequestValidator.ValidateAndThrowAsync(request, token);

            var module = await repo.GetModuleByIdAsync(moduleId, productId, currentUser.GetUserId(), token) ?? throw new ResourceNotFoundException();

            ProductMapper.MapToModule(module, request);
            await repo.UpdateEntityAsync(module, token);
        }

        public Task DeleteModuleAsync(long productId, long moduleId, CancellationToken token)
        {
            return repo.DeleteModuleAsync(productId, moduleId, currentUser.GetUserId(), token);
        }

        public async Task<long> CreateLessonAsync(long productId, long moduleId, LessonCreateRequest request, CancellationToken token)
        {
            await lessonCreateRequestValidator.ValidateAndThrowAsync(request, token);

            if (!await repo.ModuleExistsAsync(moduleId, productId, currentUser.GetUserId(), token))
                throw new ResourceNotFoundException();

            var lesson = ProductMapper.FromLessonCreateRequest(request);
            await repo.AddEntityAsync(lesson, token);

            return lesson.Id;
        }

        public async Task UpdateLessonAsync(long productId, long moduleId, long lessonId, LessonUpdateRequest request, CancellationToken token)
        {
            await lessonUpdateRequestValidator.ValidateAndThrowAsync(request, token);

            var lesson = await repo.GetLessonByIdAsync(
                lessonId,
                moduleId,
                productId,
                currentUser.GetUserId(),
                token
            ) ?? throw new ResourceNotFoundException();

            ProductMapper.MapToLesson(lesson, request);
            await repo.UpdateEntityAsync(lesson, token);
        }

        public async Task DeleteLessonAsync(long productId, long moduleId, long lessonId, CancellationToken token)
        {
            await repo.DeleteLessonAsync(productId, moduleId, lessonId, currentUser.GetUserId(), token);
        }

        public async Task SetProductScheduledAsync(long productId, string startTime, string endTime, CancellationToken token)
        {
            var product = await repo.GetProductByIdAsync(productId, false, token) ?? throw new ResourceNotFoundException();
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
}