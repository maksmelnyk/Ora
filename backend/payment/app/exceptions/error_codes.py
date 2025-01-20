from enum import Enum
from http import HTTPStatus

class ErrorCode(str, Enum):
    ERROR_INTERNAL_SERVER = "ERROR_INTERNAL_SERVER"
    ERROR_MODEL_VALIDATION = "ERROR_MODEL_VALIDATION"
    ERROR_TOKEN_INVALID = "ERROR_TOKEN_INVALID"
    ERROR_PUBLIC_KEY_FETCH = "ERROR_PUBLIC_KEY_FETCH"
    ERROR_KEYS_EXPIRED = "ERROR_KEYS_EXPIRED"
    ERROR_AUTHORIZATION_FAILED = "ERROR_AUTHORIZATION_FAILED"


def map_error_code_to_status(error_code: str) -> int:
    error_code_mapping: dict[str, HTTPStatus] = {
        ErrorCode.ERROR_TOKEN_INVALID: HTTPStatus.UNAUTHORIZED,
        ErrorCode.ERROR_PUBLIC_KEY_FETCH: HTTPStatus.UNAUTHORIZED,
        ErrorCode.ERROR_KEYS_EXPIRED: HTTPStatus.UNAUTHORIZED,
        ErrorCode.ERROR_AUTHORIZATION_FAILED: HTTPStatus.FORBIDDEN,
        # Add more mappings as needed
    }
    return error_code_mapping.get(error_code, HTTPStatus.INTERNAL_SERVER_ERROR)
