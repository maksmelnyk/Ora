using FluentValidation;
using Learning.Features.Products.Contracts;

namespace Learning.Features.Products.Validators;

public class ModuleCreateRequestValidator : AbstractValidator<ModuleCreateRequest>
{
    public ModuleCreateRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.SortOrder).GreaterThanOrEqualTo(0);
        RuleForEach(x => x.Lessons).SetValidator(new LessonCreateRequestValidator());
    }
}

public class ModuleUpdateRequestValidator : AbstractValidator<ModuleUpdateRequest>
{
    public ModuleUpdateRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.SortOrder).GreaterThanOrEqualTo(0);
    }
}