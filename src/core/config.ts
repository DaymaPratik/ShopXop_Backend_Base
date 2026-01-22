import dotenv from "dotenv";
if (process.env.NODE_ENV === "uat") {
  dotenv.config({ path: ".env.uat" });
} else {
  dotenv.config();
}

export const config = {
  db: {
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
    database: process.env.MONGO_DB || "shopxop",
  },
  isDev: process.env.NODE_ENV !== "uat" && process.env.NODE_ENV !== "production",
};


export const PORT: number = Number(process.env.PORT) || 4420;
export const PATH = "/shopxop/api";


export const ENABLE_ENCRYPTION = false;
export const ENCRYPTION_SECRET_KEY =
  process.env.ENCRYPTION_SECRET_KEY || "ShopXop@2025";
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;


export const JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || "shopxop_jwt_secret_key";
export const JWT_EXP = process.env.JWT_EXP || "2d";
export const REFRESH_JWT_EXP = process.env.REFRESH_JWT_EXP || "30d";

export const NON_ENCRYPTION_ENDPOINTS = [
  `${PATH}/security/encryption`,
  `${PATH}/security/decryption`,
  `${PATH}/security/saltencryption`,
];


export enum StatusCode {
  SUCCESS = "10000",
  FAILURE = "10001",
  INVALID_ENCRYPTED_INPUT = "10004",
  INVALID_ACCESS_TOKEN='10005'
}


export enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_FOUND = 405,
  INTERNAL_ERROR = 500,
}
