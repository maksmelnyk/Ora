using System.Net;

namespace Learning.Exceptions;

public class AppException(string errorMessage, string errorCode, HttpStatusCode statusCode) : Exception(errorMessage)
{
    public HttpStatusCode StatusCode { get; } = statusCode;
    public string ErrorCode { get; } = errorCode;
    public string ErrorMessage { get; } = errorMessage;

    public static AppException BadRequest(string errorMessage, string errorCode)
    {
        return new AppException(errorMessage, errorCode, HttpStatusCode.BadRequest);
    }

    public static AppException Unauthorized(string errorMessage, string errorCode)
    {
        return new AppException(errorMessage, errorCode, HttpStatusCode.Unauthorized);
    }

    public static AppException NotFound(string errorMessage, string errorCode)
    {
        return new AppException(errorMessage, errorCode, HttpStatusCode.NotFound);
    }

    public static AppException InternalServerError(string errorMessage = "An unexpected error occurred.", string errorCode = "ERROR_INTERNAL_SERVER_ERROR")
    {
        return new AppException(errorMessage, errorCode, HttpStatusCode.InternalServerError);
    }
}
