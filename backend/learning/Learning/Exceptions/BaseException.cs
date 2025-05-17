namespace Learning.Exceptions;

public abstract class BaseException(string message, string code) : Exception(message)
{
    public string Code { get; } = code;
}

public class UnprocessableEntityException(string message, string code) : BaseException(message, code);

public class NotFoundException(string message, string code) : BaseException(message, code);

public class ForbiddenException() : BaseException("Access denied", ErrorCode.AccessDenied);
