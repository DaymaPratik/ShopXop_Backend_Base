import { Response } from "express";
import {
  AuthFailureResponse,
  AccessTokenErrorResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
  FailureMsgResponse,
  MethodNotFoundResponse,
} from "./ApiResponse";

/**
 * Error Types
 */
export enum ErrorType {
  BAD_TOKEN = "BadTokenError",
  TOKEN_EXPIRED = "TokenExpiredError",
  UNAUTHORIZED = "AuthFailureError",
  ACCESS_TOKEN = "AccessTokenError",
  INTERNAL = "InternalError",
  NOT_FOUND = "NotFoundError",
  METHOD_NOT_FOUND = "MethodNotFoundError",
  NO_ENTRY = "NoEntryError",
  NO_DATA = "NoDataError",
  BAD_REQUEST = "BadRequestError",
  FORBIDDEN = "ForbiddenError",
  DB_ERROR = "DBError",
  CORS_ERROR = "CorsError",
}

/**
 * Base API Error
 */
export abstract class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public message: string = "error"
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Centralized error handler
   */
  public static handle(err: ApiError, res: Response): Response {
    switch (err.type) {
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res);

      case ErrorType.ACCESS_TOKEN:
        return new AccessTokenErrorResponse(err.message).send(res);

      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message).send(res);

      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(err.message).send(res);

      case ErrorType.METHOD_NOT_FOUND:
        return new MethodNotFoundResponse(err.message).send(res);

      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res);

      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res);

      case ErrorType.DB_ERROR:
        return new FailureMsgResponse(err.message).send(res);

      default: {
        const error: any = err;
        console.error("Unhandled API Error:", error);
        return new InternalErrorResponse(err.message).send(res);
      }
    }
  }
}

/**
 * Specific Error Implementations
 */

export class CorsError extends ApiError {
  constructor(message: string = "Not allowed by CORS") {
    super(ErrorType.CORS_ERROR, message);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = "Invalid credentials") {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = "Internal server error") {
    super(ErrorType.INTERNAL, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request") {
    super(ErrorType.BAD_REQUEST, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not found") {
    super(ErrorType.NOT_FOUND, message);
  }
}

export class MethodNotFoundError extends ApiError {
  constructor(message = "Method not allowed") {
    super(ErrorType.METHOD_NOT_FOUND, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Permission denied") {
    super(ErrorType.FORBIDDEN, message);
  }
}

export class NoEntryError extends ApiError {
  constructor(message = "Entry does not exist") {
    super(ErrorType.NO_ENTRY, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = "Invalid token") {
    super(ErrorType.BAD_TOKEN, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = "Token expired") {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}

export class NoDataError extends ApiError {
  constructor(message = "No data available") {
    super(ErrorType.NO_DATA, message);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = "Invalid access token") {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}

export class DBValidationError extends ApiError {
  constructor(message = "Invalid database input") {
    super(ErrorType.DB_ERROR, message);
  }
}
