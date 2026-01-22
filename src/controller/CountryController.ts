// src/controllers/CountryController.ts
import { BaseController } from "./BaseController";
import { CountryService } from "../services/CountryService";
import { APP_ROUTES } from "../core/AppRoutes";

export class CountryController extends BaseController<CountryService> {
  constructor(
    path: APP_ROUTES = APP_ROUTES.COUNTRY,
    service = new CountryService()
  ) {
    super(path, service);
  }

  protected _initialiseRoutes(): void {
    super._initialiseRoutes();
  }
}
