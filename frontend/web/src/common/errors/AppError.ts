export class AppError extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly statusCode?: number;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", code: string, statusCode?: number) {
    super(message, code, statusCode);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code: string, statusCode?: number) {
    super(message, code, statusCode);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", code: string, statusCode?: number) {
    super(message, code, statusCode);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", code: string, statusCode?: number) {
    super(message, code, statusCode);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", code: string, statusCode?: number) {
    super(message, code, statusCode);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(
    message = "Unprocessable entity",
    code: string,
    statusCode?: number
  ) {
    super(message, code, statusCode);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    code: string,
    details: Record<string, string>,
    statusCode?: number
  ) {
    super(message, code, statusCode, details);
  }
}

export class InternalError extends AppError {
  constructor(
    message = "Internal server error",
    code: string,
    statusCode?: number
  ) {
    super(message, code, statusCode);
  }
}
