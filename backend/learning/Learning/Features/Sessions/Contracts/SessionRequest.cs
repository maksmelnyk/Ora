using FluentValidation;
using Learning.Data.Entities;

namespace Learning.Features.Sessions.Contracts;

public class SessionRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
    public SessionType Type { get; set; }
    public SessionOptionRequest[] Options { get; set; }
}

public class SessionOptionRequest
{
    public int Duration { get; set; }
}

public class SessionRequestValidator : AbstractValidator<SessionRequest>
{
    public SessionRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Options).NotNull().NotEmpty();
    }
}