export interface ErrorCode {
  type: string;
  message: string;
  status: number;
}

export type ErrorCodeKey = keyof typeof ErrorCodes;

export const ErrorCodes = {

  E10001: {
    type: "NotFound",
    message: "The requested resource was not found.",
    status: 404,
  },

  E10002: {
    type: "Unauthorized",
    message: "You are not authorized to perform this action.",
    status: 401,
  },

  E10003: {
    type: "Forbidden",
    message: "Access to this resource is forbidden.",
    status: 403,
  },

  E10004: {
    type: "Validation",
    message: "The data provided did not pass validation.",
    status: 400,
  },

  E10005: {
    type: "Internal",
    message: "An unexpected error occurred on the server.",
    status: 500,
  },

  E10007: {
    type: "Conflict",
    message: "There is a conflict with the current state of the resource.",
    status: 409,
  },
  
  E10008: {
    type: "RollBack",
    message: "Rollback Error",
    status: 400,
  },

E10050: {
  type: "ResetRequestInvalid",
  message: "Invalid password reset request.",
  status: 400,
},

E10051: {
  type: "ResetTokenInvalid",
  message: "Invalid or malformed password reset token.",
  status: 400,
},

E10052: {
  type: "ResetTokenExpired",
  message: "Password reset token has expired. Please request a new one.",
  status: 400,
},

E10053: {
  type: "ResetUserNotFound",
  message: "No user found for this password reset request.",
  status: 400,
},

E10054: {
  type: "ResetPasswordSameAsOld",
  message: "New password cannot be the same as the old password.",
  status: 400,
},
E10016: {
    type: "invaildResetRequest",
    message: "Invalid password reset request",
    status: 400,
  },

  E10028: {
    type: "UserNotFound",
    message: "User not found.For the given phone or email",
    status: 400,
  },
    E10042: {
    type: "OtpValidation",
    message: "Invalid OTP.",
    status: 400,
  },
    E10029: {
    type: "EmailOrPhone",
    message: "Email or phone required for the otp",
    status: 400,
  },
    E10030: {
    type: "ExpiredOTP",
    message: "Entered OTP is expired",
    status: 400,
  },


E10055: {
  type: "OldPasswordIncorrect",
  message: "Current password is incorrect.",
  status: 400,
},

E10056: {
  type: "ConfirmPasswordMismatch",
  message: "Confirm password does not match the new password.",
  status: 400,
},

E10057: {
  type: "PasswordPolicyViolation",
  message:
    "Password does not meet security requirements (length, complexity, etc).",
  status: 400,
},

E10058: {
  type: "PasswordAlreadyUsed",
  message: "You cannot reuse your previous password.",
  status: 400,
},


  E10014: {
    type: "EmailExist",
    message: "User email already exists.",
    status: 400,
  },

  E10015: {
    type: "InvalidCredentials",
    message: "Invalid credentials. Please check email or password.",
    status: 400,
  },

  E10019: {
    type: "Login",
    message: "Please enter a valid email and password.",
    status: 401,
  },

  E10020: {
    type: "Access",
    message: "You are not authorized to perform this activity.",
    status: 401,
  },

  E10036: {
    type: "PhoneExist",
    message: "Phone number already exists. It must be unique.",
    status: 400,
  },

  E10031: {
    type: "IdValidation",
    message: "ID is required.",
    status: 400,
  },

  E10032: {
    type: "DeleteMultiple",
    message: "Invalid IDs or IDs not found.",
    status: 400,
  },

  E10039: {
    type: "DataNotFound",
    message: "Data not found.",
    status: 400,
  },
} as const;
