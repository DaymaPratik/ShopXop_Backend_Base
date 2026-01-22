// import { Response } from "express";
// import { ENABLE_ENCRYPTION, ResponseStatus, StatusCode } from "./config";
// import { EncryptionAndDecryption } from "./EncryptionAndDecryption";


// abstract class ApiResponse {
//   constructor(
//     protected statusCode: StatusCode,
//     protected status: ResponseStatus,
//     protected message: string
//   ) {}

//   protected prepare<T extends ApiResponse>(
//     res: Response,
//     response: T
//   ): Response {
//     const clientResponse = ApiResponse.sanitize(response, res.req.url);
//     return res.status(this.status).json(clientResponse);
//   }

//   public send(res: Response): Response {
//     return this.prepare<ApiResponse>(res, this);
//   }


//   private static sanitize<T extends ApiResponse>(
//     response: T,
//     url: string
//   ): T {
//     const clone: T = {} as T;
//     Object.assign(clone, response);
//     delete clone.status;

//     for (const key in clone) {
//       if (clone[key as keyof T] === undefined) {
//         delete clone[key as keyof T];
//       }
//     }

   
//     if (
//       ENABLE_ENCRYPTION === true &&
//       clone["data"] &&
//       url !== "/security/encryption" &&
//       url !== "/security/decryption" &&
//       url !== "/security/saltencryption"
//     ) {
//       clone["data"] = EncryptionAndDecryption.encryption(clone["data"]);
//     }
   


//     return clone;
//   }
// }



// export class AuthFailureResponse extends ApiResponse {
//   constructor(message = "Authentication Failure") {
//     super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
//   }
// }

// export class NotFoundResponse extends ApiResponse {
//   private url?: string;

//   constructor(message = "Not Found") {
//     super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
//   }

//   send(res: Response): Response {
//     this.url = res.req?.originalUrl;
//     return super.prepare<NotFoundResponse>(res, this);
//   }
// }

// export class MethodNotFoundResponse extends ApiResponse {
//   private url?: string;

//   constructor(message = "Method Not Found") {
//     super(StatusCode.FAILURE, ResponseStatus.METHOD_NOT_FOUND, message);
//   }

//   send(res: Response): Response {
//     this.url = res.req?.originalUrl;
//     return super.prepare<MethodNotFoundResponse>(res, this);
//   }
// }

// export class ForbiddenResponse extends ApiResponse {
//   constructor(message = "Forbidden") {
//     super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
//   }
// }

// export class BadRequestResponse extends ApiResponse {
//   constructor(message = "Bad Parameters") {
//     super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
//   }
// }

// export class BadRequestResponseWithDetailMsg extends ApiResponse {
//   constructor(message = "Bad Parameters", private detailMsg: any[] = []) {
//     super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
//   }
// }

// export class InternalErrorResponse extends ApiResponse {
//   constructor(message = "Internal Error") {
//     super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
//   }
// }



// export class SuccessMsgResponse extends ApiResponse {
//   constructor(message: string) {
//     super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
//   }
// }

// export class FailureMsgResponse<T> extends ApiResponse {
//   constructor(message: string) {
//     super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
//   }

//   send(res: Response): Response {
//     return super.prepare<FailureMsgResponse<T>>(res, this);
//   }
// }

// export class SuccessResponse<T> extends ApiResponse {
//   constructor(message: string, private data: T) {
//     super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
//   }

//   send(res: Response): Response {
//     return super.prepare<SuccessResponse<T>>(res, this);
//   }
// }


// export class AccessTokenErrorResponse extends ApiResponse {
//   private instruction = "refresh_token";

//   constructor(message = "Access token invalid") {
//     super(
//       StatusCode.INVALID_ENCRYPTED_INPUT,
//       ResponseStatus.UNAUTHORIZED,
//       message
//     );
//   }

//   send(res: Response): Response {
//     res.setHeader("instruction", this.instruction);
//     return super.prepare<AccessTokenErrorResponse>(res, this);
//   }
// }

// export class TokenRefreshResponse extends ApiResponse {
//   constructor(
//     message: string,
//     private accessToken: string,
//     private refreshToken: string
//   ) {
//     super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
//   }

//   send(res: Response): Response {
//     return super.prepare<TokenRefreshResponse>(res, this);
//   }
// }

import { Response } from "express";
import {
  ENABLE_ENCRYPTION,
  ResponseStatus,
  StatusCode,
  NON_ENCRYPTION_ENDPOINTS,
} from "./config";
import { EncryptionAndDecryption } from "./EncryptionAndDecryption";

/* =====================================================
   BASE API RESPONSE
===================================================== */
abstract class ApiResponse {
  constructor(
    protected statusCode: StatusCode,
    protected status: ResponseStatus,
    protected message: string
  ) {}

  protected prepare<T extends ApiResponse>(
    res: Response,
    response: T
  ): Response {
    const clientResponse = ApiResponse.sanitize(
      response,
      res.req.originalUrl // ✅ IMPORTANT
    );
    return res.status(this.status).json(clientResponse);
  }

  public send(res: Response): Response {
    return this.prepare<ApiResponse>(res, this);
  }

  /* =====================================================
     SANITIZE + ENCRYPT RESPONSE
  ===================================================== */
  private static sanitize<T extends ApiResponse>(
    response: T,
    url: string
  ): T {
    const clone: any = {};
    Object.assign(clone, response);

    // remove internal fields
    delete clone.status;

    // remove undefined values
    Object.keys(clone).forEach((key) => {
      if (clone[key] === undefined) delete clone[key];
    });

    /* =====================================================
       ENCRYPT DATA (EXCEPT SECURITY ROUTES)
    ===================================================== */
    if (
      ENABLE_ENCRYPTION &&
      clone.data &&
      !NON_ENCRYPTION_ENDPOINTS.some((endpoint) =>
        url.includes(endpoint)
      )
    ) {
      clone.data = EncryptionAndDecryption.encryption(clone.data);
    }

    return clone as T;
  }
}

/* =====================================================
   ERROR RESPONSES
===================================================== */

export class AuthFailureResponse extends ApiResponse {
  constructor(message = "Authentication Failure") {
    super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  private url?: string;

  constructor(message = "Not Found") {
    super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
  }

  send(res: Response): Response {
    this.url = res.req.originalUrl;
    return super.prepare<NotFoundResponse>(res, this);
  }
}

export class MethodNotFoundResponse extends ApiResponse {
  private url?: string;

  constructor(message = "Method Not Found") {
    super(StatusCode.FAILURE, ResponseStatus.METHOD_NOT_FOUND, message);
  }

  send(res: Response): Response {
    this.url = res.req.originalUrl;
    return super.prepare<MethodNotFoundResponse>(res, this);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(message = "Forbidden") {
    super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message = "Bad Parameters") {
    super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
  }
}

export class BadRequestResponseWithDetailMsg extends ApiResponse {
  constructor(message = "Bad Parameters", private detailMsg: any[] = []) {
    super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message = "Internal Error") {
    super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
  }
}

/* =====================================================
   SUCCESS RESPONSES
===================================================== */

export class SuccessMsgResponse extends ApiResponse {
  constructor(message: string) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }
}

export class FailureMsgResponse<T> extends ApiResponse {
  constructor(message: string) {
    super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
  }

  send(res: Response): Response {
    return super.prepare<FailureMsgResponse<T>>(res, this);
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(message: string, private data: T) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response): Response {
    return super.prepare<SuccessResponse<T>>(res, this);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  private instruction = "refresh_token";

  constructor(message = "Access token invalid") {
    super(
      StatusCode.INVALID_ACCESS_TOKEN,
      ResponseStatus.UNAUTHORIZED,
      message
    );
  }

  send(res: Response): Response {
    res.setHeader("instruction", this.instruction);
    return super.prepare<AccessTokenErrorResponse>(res, this);
  }
}

export class TokenRefreshResponse extends ApiResponse {
  constructor(
    message: string,
    private accessToken: string,
    private refreshToken: string
  ) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response): Response {
    return super.prepare<TokenRefreshResponse>(res, this);
  }
}

