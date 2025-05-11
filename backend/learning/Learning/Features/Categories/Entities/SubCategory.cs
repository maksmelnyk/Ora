using Learning.Features.Products.Entities;

namespace Learning.Features.Categories.Entities;

public class SubCategory
{
    public long Id { get; set; }
    public string Name { get; set; }
    public long CategoryId { get; set; }
    public Category Category { get; set; }
    public virtual ICollection<Product> Products { get; set; }
}