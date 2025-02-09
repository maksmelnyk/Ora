namespace Learning.Exceptions;

public abstract class AppException(string message, string errorCode) : Exception(message)
{
    public string ErrorCode { get; } = errorCode;
}

public class ResourceNotFoundException(string message, string errorCode) : AppException(message, errorCode);

public class InvalidRequestException(string message, string errorCode) : AppException(message, errorCode);
