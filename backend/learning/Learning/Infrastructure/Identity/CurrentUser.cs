using System.Security.Claims;

namespace Learning.Infrastructure.Identity;

public interface ICurrentUser
{
    Guid GetUserId();
}

public class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    public Guid GetUserId()
    {
        string userId = accessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userId, out var id))
            throw new ArgumentException(nameof(userId));

        return id;
    }
}