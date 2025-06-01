using FluentValidation;
using Learning.Features.Products.Contracts;
using Learning.Features.Products.Entities;
using Learning.Shared;

namespace Learning.Features.Products.Validators;

public class ProductCreateRequestValidator : AbstractValidator<ProductCreateRequest>
{
    public ProductCreateRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Level).IsInEnum();
        RuleFor(x => x.SubCategoryId).GreaterThan(0);
        RuleFor(x => x.Objectives).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Highlights).NotEmpty();
        RuleFor(x => x.Audience).NotEmpty();
        RuleFor(x => x.Requirements).NotEmpty();
        RuleFor(x => x.ImageUrl).NotEmpty();
        RuleFor(x => x.VideoUrl).NotEmpty();
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Language).NotEmpty().Length(3).Must(IsoLanguageValidator.IsValidIso639_2).WithMessage("Invalid ISO 639-2 language code");
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