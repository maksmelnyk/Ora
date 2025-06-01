using Learning.Features.Products.Contracts;
using Learning.Features.Products.Entities;
using Learning.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Learning.Features.Products;

public interface IProductRepository
{
    Task<(Product[] Items, int TotalItems)> GetProductsAsync(
        bool activeOnly,
        ProductFilter filter,
        int skip,
        int take,
        CancellationToken token
    );
    Task<Product[]> GetEducatorProductsAsync(
        bool activeOnly,
        Guid educatorId,
        long? id,
        int take,
        CancellationToken token
    );
    Task<Product[]> GetEnrolledProductsAsync(Guid userId, long? id, int take, CancellationToken token);
    Task<Product> GetProductByIdAsync(long id, bool withModules, CancellationToken token);
    Task<long[]> GetProductLessonIds(long id, CancellationToken token);
    Task<bool> ProductExistsAsync(long id, Guid educatorId, CancellationToken token);
    Task<bool> AnyProductExistsAsync(Guid educatorId, CancellationToken token);
    Task<Module> GetModuleByIdAsync(long id, long productId, Guid educatorId, CancellationToken token);
    Task<bool> ModuleExistsAsync(long id, long productId, Guid educatorId, CancellationToken token);
    Task<Lesson> GetLessonByIdAsync(long id, long moduleId, long productId, Guid educatorId, CancellationToken token);
    Task SetProductHasEnrollmentAsync(long id, CancellationToken token);
    Task AddEntityAsync<T>(T entity, CancellationToken token);
    Task UpdateEntityAsync<T>(T entity, CancellationToken token);
    Task DeleteModuleAsync(long productId, long moduleId, Guid educatorId, CancellationToken token);
    Task DeleteLessonAsync(long productId, long moduleId, long lessonId, Guid educatorId, CancellationToken token);
}

public class ProductRepository(AppDbContext db) : IProductRepository
{
    public async Task<(Product[] Items, int TotalItems)> GetProductsAsync(
        bool activeOnly,
        ProductFilter filter,
        int skip,
        int take,
        CancellationToken token
    )
    {
        var products = activeOnly is true ? GetActiveProducts() : GetNonDeletedProducts();

        products = ApplyProductFilters(products, filter);

        var totalItems = await products.CountAsync(token);
        var items = await products.Skip(skip).Take(take).ToArrayAsync(token);

        return (items, totalItems);
    }

    public Task<Product[]> GetEducatorProductsAsync(
        bool activeOnly,
        Guid educatorId,
        long? id,
        int take,
        CancellationToken token
    )
    {
        var products = activeOnly is true ? GetActiveProducts() : GetNonDeletedProducts();

        return products.Where(e => e.EducatorId == educatorId)
            .Where(e => id == null || e.Id > id)
            .OrderBy(e => e.Id)
            .Take(take)
            .ToArrayAsync(token);
    }

    public Task<Product[]> GetEnrolledProductsAsync(Guid userId, long? id, int take, CancellationToken token)
    {
        return db.Products.Where(e => e.DeletedAt == null)
            .Where(e => db.Enrollments.Any(i => i.ProductId == e.Id && i.UserId == userId))
            .Where(e => id == null || e.Id > id)
            .OrderBy(e => e.Id)
            .Take(take)
            .ToArrayAsync(token);
    }

    public Task<Product> GetProductByIdAsync(long id, bool withModules, CancellationToken token)
    {
        var products = GetNonDeletedProducts();

        if (withModules)
            products = products
                .Include(e => e.Modules.Where(i => i.DeletedAt == null))
                .ThenInclude(e => e.Lessons.Where(i => i.DeletedAt == null));

        return products.FirstOrDefaultAsync(e => e.Id == id, token);
    }

    public Task<long[]> GetProductLessonIds(long id, CancellationToken token)
    {
        return GetNonDeletedLessons().Where(e => e.Module.ProductId == id).Select(e => e.Id).ToArrayAsync(token);
    }

    public Task<bool> ProductExistsAsync(long id, Guid educatorId, CancellationToken token)
    {
        return db.Products.AnyAsync(e => e.Id == id && e.EducatorId == educatorId && e.DeletedAt == null, token);
    }

    public Task<bool> AnyProductExistsAsync(Guid educatorId, CancellationToken token)
    {
        return db.Products.AnyAsync(e => e.EducatorId == educatorId, token);
    }

    public Task<Module> GetModuleByIdAsync(long id, long productId, Guid educatorId, CancellationToken token)
    {
        return GetNonDeletedModules().FirstOrDefaultAsync(
            e => e.Id == id && e.ProductId == productId && e.Product.EducatorId == educatorId, token
        );
    }

    public Task<bool> ModuleExistsAsync(long id, long productId, Guid educatorId, CancellationToken token)
    {
        return GetNonDeletedModules().AnyAsync(
            e => e.Id == id && e.ProductId == productId && e.Product.EducatorId == educatorId, token
        );
    }

    public Task<Lesson> GetLessonByIdAsync(long id, long moduleId, long productId, Guid educatorId, CancellationToken token)
    {
        return GetNonDeletedLessons().FirstOrDefaultAsync(
            e => e.Id == id &&
                e.ModuleId == moduleId &&
                e.Module.ProductId == productId &&
                e.Module.Product.EducatorId == educatorId,
            token
        );
    }

    public Task SetProductHasEnrollmentAsync(long id, CancellationToken token)
    {
        return db.Products
            .Where(e => e.Id == id)
            .ExecuteUpdateAsync(e => e.SetProperty(i => i.HasEnrollment, true), token);
    }

    public async Task AddEntityAsync<T>(T entity, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(entity);

        await db.AddAsync(entity, token);
        await db.SaveChangesAsync(token);
    }

    public async Task UpdateEntityAsync<T>(T entity, CancellationToken token)
    {
        ArgumentNullException.ThrowIfNull(entity);

        await db.SaveChangesAsync(token);
    }

    public Task DeleteModuleAsync(long productId, long moduleId, Guid educatorId, CancellationToken token)
    {
        return db.Modules.Where(
            e => e.Id == moduleId &&
                e.ProductId == productId &&
                e.Product.EducatorId == educatorId &&
                e.Product.DeletedAt == null)
            .ExecuteUpdateAsync(e => e.SetProperty(i => i.DeletedAt, DateTime.UtcNow), token);
    }

    public Task DeleteLessonAsync(long productId, long moduleId, long lessonId, Guid educatorId, CancellationToken token)
    {
        return db.Lessons.Where(
            e => e.Id == lessonId &&
                e.ModuleId == moduleId &&
                e.Module.ProductId == productId &&
                e.Module.Product.EducatorId == educatorId &&
                e.Module.Product.DeletedAt == null)
            .ExecuteUpdateAsync(e => e.SetProperty(i => i.DeletedAt, DateTime.UtcNow), token);
    }

    private IQueryable<Product> GetNonDeletedProducts()
    {
        return db.Products.Include(e => e.GroupSessionProduct)
            .Include(e => e.PrivateSessionProduct)
            .Include(e => e.OnlineCourseProduct)
            .Where(e => e.DeletedAt == null);
    }

    private IQueryable<Module> GetNonDeletedModules()
    {
        return db.Modules.Where(e => e.DeletedAt == null && e.Product.DeletedAt == null);
    }

    private IQueryable<Lesson> GetNonDeletedLessons()
    {
        return db.Lessons.Where(e => e.DeletedAt == null && e.Module.DeletedAt == null && e.Module.Product.DeletedAt == null);
    }

    private IQueryable<Product> GetActiveProducts()
    {
        var products = GetNonDeletedProducts();

        return products.Where(e => e.Status == ProductStatus.Active &&
            (e.Type == ProductType.PrivateSession ||
            e.Type == ProductType.PreRecordedCourse ||
            (e.LastScheduledAt != null && e.LastScheduledAt > DateTime.UtcNow))
        );
    }

    private IQueryable<Product> ApplyProductFilters(IQueryable<Product> products, ProductFilter filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Title))
            products = products.Where(e => e.Title.ToLower().Contains(filter.Title.ToLower()));

        if (filter.Type.HasValue)
            products = products.Where(e => e.Type == filter.Type.Value);

        if (filter.EducatorId.HasValue)
            products = products.Where(e => e.EducatorId == filter.EducatorId.Value);

        if (filter.CategoryId.HasValue)
            products = products.Where(e => e.SubCategory.CategoryId == filter.CategoryId.Value);

        if (filter.SubCategoryId.HasValue)
            products = products.Where(e => e.SubCategoryId == filter.SubCategoryId.Value);

        if (filter.Level.HasValue)
            products = products.Where(e => e.Level == filter.Level.Value);

        if (!string.IsNullOrWhiteSpace(filter.Language))
            products = products.Where(e => e.Language == filter.Language);

        if (filter.MinPrice.HasValue)
            products = products.Where(e => e.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            products = products.Where(e => e.Price <= filter.MaxPrice.Value);

        return products;
    }
}