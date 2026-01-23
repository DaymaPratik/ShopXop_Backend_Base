import { BaseService } from "../services/BaseService";
import { OrderEntity } from "../entity/OrderEntity";
import { OrderDTO } from "../databse/repository/order/order.dto";

export class OrderService extends BaseService<OrderEntity> {
  constructor() {
    super(OrderEntity);
  }

  getDTO() {
    return OrderDTO;
  }



}
