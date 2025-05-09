namespace Learning.Features.Categories;

public interface ICategoryService
{
    Task<CategoryResponse[]> GetCategoriesAsync(CancellationToken token);
}

public class CategoryService(ICategoryRepository repo) : ICategoryService
{
    public async Task<CategoryResponse[]> GetCategoriesAsync(CancellationToken token)
    {
        var categories = await repo.GetCategoriesAsync(token);
        return [.. categories.Select(e => new CategoryResponse(e.Id, e.Name, [.. e.SubCategories.Select(s => new SubCategoryResponse(s.Id, s.Name))]))];
    }
}