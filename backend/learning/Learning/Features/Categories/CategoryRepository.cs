using Learning.Features.Categories.Entities;
using Learning.Infrastructure.Data;
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