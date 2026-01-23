import jwt from "jsonwebtoken";
import {
  JWT_SECRET_KEY,
  JWT_EXP,
  REFRESH_JWT_EXP,
} from "./config";


export const createjwt = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXP,
  });
};


export const refreshjwt = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: REFRESH_JWT_EXP,
  });
};


export const verifyjwt = (token: string): any => {
  return jwt.verify(token, JWT_SECRET_KEY, {
    ignoreExpiration: true,
  });
};

 
export const isTokenValid = async (token: {
  exp?: number;
}): Promise<boolean> => {
  const currentUnixTime = Math.floor(Date.now() / 1000);

  if (
    token.exp !== undefined &&
    typeof token.exp === "number" &&
    token.exp > currentUnixTime
  ) {
    return true;
  }

  return false;
};
