namespace Learning.Exceptions;

public abstract class AppException(string message, string errorCode) : Exception(message)
{
    public string ErrorCode { get; } = errorCode;
}

public class InvalidRequestException(string message, string errorCode) : AppException(message, errorCode);

public class ResourceNotFoundException() : AppException("Resource not found", Exceptions.ErrorCode.ResourceNotFound);

public class ForbiddenException() : AppException("Access denied", Exceptions.ErrorCode.AccessDenied);
