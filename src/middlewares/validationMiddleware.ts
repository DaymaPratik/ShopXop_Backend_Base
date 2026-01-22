
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { GenericResponse } from "../core/GenericResponse";
import { StatusCode, ResponseStatus } from "../core/config";

export const validationMiddleware =
  (DtoClass: any, skipMissing = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(DtoClass, req.body);

    const errors = await validate(dtoObject, {
      skipMissingProperties: skipMissing,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const message = errors
        .map(err => Object.values(err.constraints || {}).join(", "))
        .join(" | ");

      const response = new GenericResponse();
      response.setStatus(StatusCode.FAILURE);
      response.setMsg("Validation failed");
      response.setError(message);

      return res.status(ResponseStatus.BAD_REQUEST).json(response);
    }

    // Replace body with validated & transformed DTO
    req.body = dtoObject;
    next();
  };
