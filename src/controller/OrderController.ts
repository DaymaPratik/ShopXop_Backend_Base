
import { BaseController } from "./BaseController";
import { OrderService } from "../services/OrderService";
import { APP_ROUTES } from "../core/AppRoutes";


export class OrderController extends BaseController<OrderService> {
  constructor(
    path: APP_ROUTES = APP_ROUTES.ORDERS,
    service = new OrderService()
  ) {
    super(path, service);
  }

  protected _initialiseRoutes(): void {
    super._initialiseRoutes();
  }


}
