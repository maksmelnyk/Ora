using Learning.Features.Products.Services;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Learning.Features.Products;

public static class ServiceConfiguration
{
    public static void AddProducts(this IServiceCollection services)
    {
        services.TryAddScoped<IProductRepository, ProductRepository>();
        services.TryAddScoped<IProductReadService, ProductReadService>();
        services.TryAddScoped<IProductWriteService, ProductWriteService>();
        services.TryAddScoped<IModuleService, ModuleService>();
        services.TryAddScoped<ILessonService, LessonService>();
    }
}