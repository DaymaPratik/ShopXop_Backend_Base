import { BaseController } from "./BaseController";
import { UserAuthProviderService } from "../services/UserAuthService";
import { APP_ROUTES } from "../core/AppRoutes";
import { Request, Response } from "express";

export class UserAuthProviderController extends BaseController<UserAuthProviderService> {
  constructor(
    path: APP_ROUTES = APP_ROUTES.USER_AUTH_PROVIDER,
    service = new UserAuthProviderService()
  ) {
    super(path, service);
  }


}
