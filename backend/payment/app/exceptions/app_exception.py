from fastapi import HTTPException


class AppHTTPException(HTTPException):
    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(status_code=status_code)
        self.code: str = code
        self.message: str = message


class AppException(Exception):
    def __init__(self, message: str, code: str) -> None:
        super().__init__(message)
        self.code: str = code
        self.message: str = message


class UnauthorizedException(AppException):
    def __init__(self, message: str, code: str) -> None:
        super().__init__(message=message, code=code)


class NotFoundException(AppException):
    def __init__(self, message: str, code: str) -> None:
        super().__init__(message=message, code=code)


class UnprocessableEntityException(AppException):
    def __init__(self, message: str, code: str) -> None:
        super().__init__(message=message, code=code)
