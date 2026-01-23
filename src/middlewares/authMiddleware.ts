import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, NO_AUTH_ROUTES } from "../core/config";
import { ApiError, BadTokenError } from "../core/ApiError";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
       const isPublicRoute = NO_AUTH_ROUTES.some(
      (route) =>
        route.path === req.path &&
        route.method === req.method
    );

    if (isPublicRoute) {
      return next();
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiError.handle(
        new BadTokenError("Authorization token missing"),
        res
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as {
      id: number;
      email: string;
      iat: number;
      exp: number;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return ApiError.handle(
      new BadTokenError("Authentication failed"),
      res
    );
  }
};

export default authMiddleware;
