using FluentValidation;
using Learning.Exceptions;
using Learning.Features.Products.Contracts;
using Learning.Infrastructure.Identity;

namespace Learning.Features.Products.Services;

public interface IModuleService
{
    Task<long> CreateModuleAsync(long productId, ModuleCreateRequest request, CancellationToken token);
    Task UpdateModuleAsync(long productId, long moduleId, ModuleUpdateRequest request, CancellationToken token);
    Task DeleteModuleAsync(long productId, long moduleId, CancellationToken token);
}

public class ModuleService(
    IProductRepository repo,
    ICurrentUser currentUser,
    IValidator<ModuleCreateRequest> moduleCreateRequestValidator,
    IValidator<ModuleUpdateRequest> moduleUpdateRequestValidator
) : IModuleService
{
    public async Task<long> CreateModuleAsync(long productId, ModuleCreateRequest request, CancellationToken token)
    {
        await moduleCreateRequestValidator.ValidateAndThrowAsync(request, token);

        if (!await repo.ProductExistsAsync(productId, currentUser.GetUserId(), token))
            throw new NotFoundException("Product not found", ErrorCode.ProductNotFound);

        var module = ProductMapper.FromModuleCreateRequest(request);
        await repo.AddEntityAsync(module, token);

        return module.Id;
    }

    public async Task UpdateModuleAsync(long productId, long moduleId, ModuleUpdateRequest request, CancellationToken token)
    {
        await moduleUpdateRequestValidator.ValidateAndThrowAsync(request, token);

        var module = await repo.GetModuleByIdAsync(moduleId, productId, currentUser.GetUserId(), token)
            ?? throw new NotFoundException("Module not found", ErrorCode.ModuleNotFound);

        ProductMapper.MapToModule(module, request);
        await repo.UpdateEntityAsync(module, token);
    }

    public Task DeleteModuleAsync(long productId, long moduleId, CancellationToken token)
    {
        return repo.DeleteModuleAsync(productId, moduleId, currentUser.GetUserId(), token);
    }
}