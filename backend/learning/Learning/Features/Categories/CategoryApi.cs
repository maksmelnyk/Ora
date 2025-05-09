namespace Learning.Features.Categories;

public static class CategoryApi
{
    public static void MapCategoryEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("api/v1/categories")
            .WithTags("Categories")
            .AllowAnonymous();

        group.MapGet("/", async (ICategoryService service, CancellationToken token) =>
        {
            var categories = await service.GetCategoriesAsync(token);
            return Results.Ok(categories);
        })
        .WithName("GetCategories")
        .WithSummary("Retrieve Categories")
        .WithDescription("Fetches a complete list of available categories. This endpoint is used for categorizing and filtering products and responds with the category data along with a 200 OK status.")
        .Produces<IEnumerable<CategoryResponse>>(StatusCodes.Status200OK);
    }
}