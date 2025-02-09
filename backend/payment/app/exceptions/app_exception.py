from fastapi import HTTPException


class AppHttpException(HTTPException):
    def __init__(self, status_code: int, error_code: str, message: str) -> None:
        super().__init__(status_code=status_code)
        self.error_code: str = error_code
        self.message: str = message


class AppException(Exception):
    def __init__(self, error_code: str, message: str) -> None:
        super().__init__(message)
        self.error_code: str = error_code
        self.message: str = message


class ResourceNotFoundException(AppException):
    pass


class InvalidRequestException(AppException):
    pass
