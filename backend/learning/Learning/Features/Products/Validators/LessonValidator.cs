using FluentValidation;
using Learning.Features.Products.Contracts;

namespace Learning.Features.Products.Validators;

public class LessonCreateRequestValidator : AbstractValidator<LessonCreateRequest>
{
    public LessonCreateRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.SortOrder).GreaterThanOrEqualTo(0);
    }
}

public class LessonUpdateRequestValidator : AbstractValidator<LessonUpdateRequest>
{
    public LessonUpdateRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.SortOrder).GreaterThanOrEqualTo(0);
    }
}