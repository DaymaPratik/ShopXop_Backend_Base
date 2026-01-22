// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET_KEY } from "../core/config";
// import { UserModel } from "../schemas/UserSchema";
// import { ApiError, BadTokenError } from "../core/ApiError";

// interface JwtPayload {
//   _id: string;
//   id: number;
//   email: string;
// }

// const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return ApiError.handle(new BadTokenError("Token missing"), res);
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

//     const user = await UserModel.findOne({
//       _id: decoded._id,
//       isDeleted: false,
//     });

//     if (!user) {
//       return ApiError.handle(new BadTokenError("Unauthorized access"), res);
//     }

//     // Attach user info
//     req.body.user = {
//       _id: user._id,
//       id: user.id,
//       email: user.email,
//       role_id: user.role_id,
//     };

//     next();
//   } catch (error) {
//     return ApiError.handle(
//       new BadTokenError("Authentication failed"),
//       res
//     );
//   }
// };

// export default authMiddleware;
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../core/config";
import { ApiError, BadTokenError } from "../core/ApiError";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiError.handle(
        new BadTokenError("Authorization token missing"),
        res
      );
    }

    const token = authHeader.split(" ")[1];

    // ✅ VERIFY TOKEN
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
