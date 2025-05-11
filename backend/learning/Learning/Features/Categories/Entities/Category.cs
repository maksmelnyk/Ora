namespace Learning.Features.Categories.Entities;

public class Category
{
    public long Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<SubCategory> SubCategories { get; set; }
}