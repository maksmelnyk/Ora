using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Learning.Features.Products;

public static class ServiceConfiguration
{
    public static void AddProducts(this IServiceCollection services)
    {
        services.TryAddScoped<IProductRepository, ProductRepository>();
        services.TryAddScoped<IProductQueryService, ProductQueryService>();
        services.TryAddScoped<IProductManagementService, ProductManagementService>();
    }
}