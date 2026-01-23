
import { Request, Response } from "express";
import { APP_ROUTES } from "../core/AppRoutes";
import { BaseController } from "./BaseController";
import UserService from "../services/UserService";
import { GenericResponse } from "../core/GenericResponse";
import { StatusCode, ResponseStatus } from "../core/config";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { RegisterUserDto, UserDto } from "../databse/repository/user/user.dto";


export class UserController extends BaseController<UserService> {
  constructor(
    path: APP_ROUTES = APP_ROUTES.USER,
    service = new UserService()
  ) {
    super(path, service);

    this.router.post(`${this.path}/register`,validationMiddleware(RegisterUserDto), this.register);
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/forgot-password`, this.forgotPassword);
    this.router.post(`${this.path}/reset-password`, this.resetPassword);
  }

  

  private register = async (req: Request, res: Response) => {
    const user = await this.service.register(req.body);

    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("User registered successfully");
    response.setData(
      { id: user._id, name: user.name, email: user.email },
      req.originalUrl
    );

    res.status(ResponseStatus.SUCCESS).send(response);
  };

  private login = async (req: Request, res: Response) => {
    const result = await this.service.login(req.body);

    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("Login successful");
    response.setData(result, req.originalUrl);

    res.status(ResponseStatus.SUCCESS).send(response);
  };

    private forgotPassword = async (req: Request, res: Response) => {
    const result = await this.service.forgotPassword(req.body);
    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("OTP sent successfully");
    response.setData(result, req.originalUrl);
    res.status(ResponseStatus.SUCCESS).send(response);
  };

  private resetPassword = async (req: Request, res: Response) => {
    const result = await this.service.resetPassword(req.body);
    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("Password reset successfully");
    response.setData(result, req.originalUrl);
    res.status(ResponseStatus.SUCCESS).send(response);
  };

}




