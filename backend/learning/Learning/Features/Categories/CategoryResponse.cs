namespace Learning.Features.Categories;

public record CategoryResponse(long Id, string Name, SubCategoryResponse[] SubCategories);
public record SubCategoryResponse(long Id, string Name);