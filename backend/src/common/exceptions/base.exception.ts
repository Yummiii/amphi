import { HttpException, HttpStatus } from "@nestjs/common";

export class BaseException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    cause?: string,
  ) {
    super(
      {
        message,
        error: HttpStatus[status],
        statusCode: status,
        ...(cause && { cause }),
      },
      status,
    );
  }
}

export class ValidationException extends BaseException {
  constructor(message: string = "Validation failed", cause?: string) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}

export class NotFoundException extends BaseException {
  constructor(resource: string = "Resource", cause?: string) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, cause);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string = "Resource already exists", cause?: string) {
    super(message, HttpStatus.CONFLICT, cause);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = "Unauthorized", cause?: string) {
    super(message, HttpStatus.UNAUTHORIZED, cause);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = "Access forbidden", cause?: string) {
    super(message, HttpStatus.FORBIDDEN, cause);
  }
}
