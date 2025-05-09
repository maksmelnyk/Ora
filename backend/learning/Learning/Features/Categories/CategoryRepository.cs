using Learning.Data;
using Learning.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Learning.Features.Categories;

public interface ICategoryRepository
{
    Task<Category[]> GetCategoriesAsync(CancellationToken token);
}

public class CategoryRepository(AppDbContext db) : ICategoryRepository
{
    public Task<Category[]> GetCategoriesAsync(CancellationToken token)
    {
        return db.Categories.Include(e => e.SubCategories).AsNoTracking().ToArrayAsync(token);
    }
}