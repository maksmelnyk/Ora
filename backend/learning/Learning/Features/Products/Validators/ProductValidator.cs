using FluentValidation;
using Learning.Data.Entities;
using Learning.Features.Products.Contracts;

namespace Learning.Features.Products.Validators;

public class ProductCreateRequestValidator : AbstractValidator<ProductCreateRequest>
{
    public ProductCreateRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.SubCategoryId).GreaterThan(0);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.DurationMin).GreaterThan(0).When(x => x.Type == ProductType.GroupSession || x.Type == ProductType.PrivateSession);
        RuleFor(x => x.MaxParticipants).GreaterThan(0).When(x => x.Type == ProductType.GroupSession || x.Type == ProductType.OnlineCourse);
        RuleFor(x => x.Modules).NotEmpty().When(x => x.Type == ProductType.OnlineCourse || x.Type == ProductType.PreRecordedCourse);
        RuleFor(x => x.Modules).Empty().When(x => x.Type != ProductType.OnlineCourse && x.Type != ProductType.PreRecordedCourse);
        RuleForEach(x => x.Modules).SetValidator(new ModuleCreateRequestValidator()).When(x => x.Type == ProductType.OnlineCourse || x.Type == ProductType.PreRecordedCourse);
    }
}

public class ProductUpdateRequestValidator : AbstractValidator<ProductUpdateRequest>
{
    public ProductUpdateRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.SubCategoryId).GreaterThan(0);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
    }
}