import { ApiError, ErrorType } from "./ApiError";
import { ErrorCodes, ErrorCodeKey } from "./ErrorCodes";

export class ErrorCodeApiError extends ApiError {
  public readonly errorCode: ErrorCodeKey;

  constructor(code: ErrorCodeKey) {
    const error = ErrorCodes[code];

    // 🔑 Map HTTP status → ErrorType
    const errorType = ErrorCodeApiError.mapStatusToErrorType(
      error.status
    );

    super(errorType, error.message);

    this.errorCode = code;
  }

  private static mapStatusToErrorType(status: number): ErrorType {
    switch (status) {
      case 400:
        return ErrorType.BAD_REQUEST;
      case 401:
        return ErrorType.UNAUTHORIZED;
      case 403:
        return ErrorType.FORBIDDEN;
      case 404:
        return ErrorType.NOT_FOUND;
      case 409:
        return ErrorType.BAD_REQUEST;
      case 501:
        return ErrorType.METHOD_NOT_FOUND;
      case 503:
        return ErrorType.INTERNAL;
      default:
        return ErrorType.INTERNAL;
    }
  }
}
