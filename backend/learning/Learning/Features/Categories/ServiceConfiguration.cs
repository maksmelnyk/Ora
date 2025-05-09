using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Learning.Features.Categories;

public static class ServiceConfiguration
{
    public static void AddCategories(this IServiceCollection services)
    {
        services.TryAddScoped<ICategoryRepository, CategoryRepository>();
        services.TryAddScoped<ICategoryService, CategoryService>();
    }
}