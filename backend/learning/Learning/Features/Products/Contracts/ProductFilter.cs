using Learning.Features.Products.Entities;

namespace Learning.Features.Products.Contracts;

public class ProductFilter
{
    public string Title { get; set; }
    public ProductType? Type { get; set; }
    public Guid? EducatorId { get; set; }
    public long? CategoryId { get; set; }
    public long? SubCategoryId { get; set; }
    public ProductLevel? Level { get; set; }
    public string Language { get; set; }
    public int? Rating { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}