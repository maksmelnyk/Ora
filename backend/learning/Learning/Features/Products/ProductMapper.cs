using Learning.Data.Entities;
using Learning.Features.Products.Contracts;
using Learning.Features.Profiles;

namespace Learning.Features.Products;

public static class ProductMapper
{
    public static ProductSummaryResponse ToProductSummary(Product product, EducatorResponse educator)
    {
        return new ProductSummaryResponse(
            product.Id,
            product.SubCategoryId,
            product.EducatorId,
            product.Type,
            product.Status,
            product.Title, product.
            Description,
            product.ImageUrl,
            product.Price,
            product.PrivateSessionProduct?.DurationMin ?? product.GroupSessionProduct?.DurationMin,
            product.GroupSessionProduct?.MaxParticipants ?? product.OnlineCourseProduct?.MaxParticipants,
            product.OnlineCourseProduct?.StartTime,
            product.OnlineCourseProduct?.EndTime,
            educator
        );
    }

    public static ProductDetailsResponse ToProductDetails(Product product, EducatorResponse educator)
    {
        return new ProductDetailsResponse(
            product.Id,
            product.SubCategoryId,
            product.Type,
            product.Status,
            product.Title,
            product.Description,
            product.ImageUrl,
            product.Price,
            product.PrivateSessionProduct?.DurationMin ?? product.GroupSessionProduct?.DurationMin,
            product.GroupSessionProduct?.MaxParticipants ?? product.OnlineCourseProduct?.MaxParticipants,
            product.OnlineCourseProduct?.StartTime,
            product.OnlineCourseProduct?.EndTime,
            educator,
            product.Modules?.Select(ToModuleResponse).ToArray()
        );
    }

    public static ModuleResponse ToModuleResponse(Module module)
    {
        return new ModuleResponse(module.Id, module.Title, module.Description, module.SortOrder, module.Lessons?.Select(ToLessonResponse).ToArray());
    }

    public static LessonResponse ToLessonResponse(Lesson lesson)
    {
        return new LessonResponse(lesson.Id, lesson.Title, lesson.Description, lesson.SortOrder, lesson.DurationMin);
    }

    public static Product FromProductCreateRequest(ProductCreateRequest request, Guid educatorId)
    {
        var product = new Product
        {
            EducatorId = educatorId,
            SubCategoryId = request.SubCategoryId,
            Status = ProductStatus.Active,
            Type = request.Type,
            Title = request.Title,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            Price = request.Price,
        };

        switch (request.Type)
        {
            case ProductType.PrivateSession:
                product.PrivateSessionProduct = new PrivateSessionProduct
                {
                    DurationMin = request.DurationMin.Value
                };
                break;
            case ProductType.GroupSession:
                product.GroupSessionProduct = new GroupSessionProduct
                {
                    DurationMin = request.DurationMin.Value,
                    MaxParticipants = request.MaxParticipants.Value
                };
                break;
            case ProductType.OnlineCourse:
                product.OnlineCourseProduct = new OnlineCourseProduct
                {
                    MaxParticipants = request.MaxParticipants.Value
                };
                break;
        }

        if (request.Type == ProductType.OnlineCourse || request.Type == ProductType.PreRecordedCourse)
        {
            product.Modules = request.Modules?.Select(FromModuleCreateRequest).ToList();
        }

        return product;
    }

    public static Module FromModuleCreateRequest(ModuleCreateRequest request)
    {
        return new Module
        {
            Title = request.Title,
            Description = request.Description,
            SortOrder = request.SortOrder,
            Lessons = request.Lessons?.Select(FromLessonCreateRequest).ToList()
        };
    }

    public static Lesson FromLessonCreateRequest(LessonCreateRequest request)
    {
        return new Lesson
        {
            Title = request.Title,
            Description = request.Description,
            SortOrder = request.SortOrder,
            DurationMin = request.DurationMin
        };
    }

    public static void MapToProduct(Product product, ProductUpdateRequest request)
    {
        product.SubCategoryId = request.SubCategoryId;
        product.Title = request.Title;
        product.Description = request.Description;
        product.ImageUrl = request.ImageUrl;
        product.Price = request.Price;

        switch (product.Type)
        {
            case ProductType.PrivateSession:
                product.PrivateSessionProduct = new PrivateSessionProduct
                {
                    DurationMin = request.DurationMin.Value
                };
                break;
            case ProductType.GroupSession:
                product.GroupSessionProduct = new GroupSessionProduct
                {
                    DurationMin = request.DurationMin.Value,
                    MaxParticipants = request.MaxParticipants.Value
                };
                break;
            case ProductType.OnlineCourse:
                product.OnlineCourseProduct = new OnlineCourseProduct
                {
                    MaxParticipants = request.MaxParticipants.Value,
                };
                break;
        }
    }

    public static void MapToModule(Module module, ModuleUpdateRequest request)
    {
        module.Title = request.Title;
        module.Description = request.Description;
        module.SortOrder = request.SortOrder;
    }

    public static void MapToLesson(Lesson lesson, LessonUpdateRequest request)
    {
        lesson.Title = request.Title;
        lesson.Description = request.Description;
        lesson.SortOrder = request.SortOrder;
        lesson.DurationMin = request.DurationMin;
    }
}