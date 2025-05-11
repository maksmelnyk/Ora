using Learning.Features.Categories.Entities;
using Learning.Shared.Interfaces;

namespace Learning.Features.Products.Entities;

public class Product : ITimeTrackable
{
    public long Id { get; set; }
    public Guid EducatorId { get; set; }
    public ProductType Type { get; set; }
    public ProductStatus Status { get; set; }
    public long SubCategoryId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public decimal Price { get; set; }
    public bool HasEnrollment { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastScheduledAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public virtual PrivateSessionProduct PrivateSessionProduct { get; set; }
    public virtual GroupSessionProduct GroupSessionProduct { get; set; }
    public virtual OnlineCourseProduct OnlineCourseProduct { get; set; }
    public virtual SubCategory SubCategory { get; set; }
    public virtual ICollection<Module> Modules { get; set; }
}

public enum ProductType
{
    PrivateSession = 0,
    GroupSession = 1,
    OnlineCourse = 2,
    PreRecordedCourse = 3
}

public enum ProductStatus
{
    Active = 0,
    Inactive = 1,
    Moderation = 2
}