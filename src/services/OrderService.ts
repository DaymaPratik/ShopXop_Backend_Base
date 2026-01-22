import { BaseService } from "../services/BaseService";
import { OrderEntity } from "../entity/OrderEntity";
// import { ObjectId } from "mongodb";
// import { ErrorCodeApiError } from "../core/ErrorCodeApiError";
// import { DeepPartial } from "typeorm";
// import { FileObject } from "../core/FileModel";
// import { UserEntity } from "../entity/UserEntity";
import { OrderDTO } from "../databse/repository/order/order.dto";
// import { Transaction } from "../core/Transaction";

export class OrderService extends BaseService<OrderEntity> {
  constructor() {
    super(OrderEntity);
  }

  getDTO() {
    return OrderDTO;
  }



//  override async createPreProcess(
//     model: Partial<OrderEntity>,
//     _files: any,
//   queryRunner: any
//   ): Promise<Partial<OrderEntity>> {

//     if (!queryRunner) {
//       throw new ErrorCodeApiError("E10005"); 
//     }

//     if (!model.user_id) {
//       throw new ErrorCodeApiError("E10031");
//     }

//     const userRepo =
//       queryRunner.manager.getMongoRepository(UserEntity);

//     const user = await userRepo.findOne({
//       where: {
//         _id: new ObjectId(model.user_id as any),
//         is_delete: false,
//       } as any,
//     });

//     if (!user) {
//       throw new ErrorCodeApiError("E10028"); 
//     }

//     console.log(user);
//     user.number_of_orders =
//       (user.number_of_orders || 0) + 1;

//     await userRepo.save(user);

//     return model;
//   }



//  protected override async deletePreProcess(
//     order: OrderEntity
//   ): Promise<OrderEntity> {
//     // Update user's order count before deleting the order
//     if (order.user_id) {
//       const connection = this.repository.manager.connection;
//       const userRepo = connection.getMongoRepository(UserEntity);
      
//       const user = await userRepo.findOne({
//         where: { _id: new ObjectId(order.user_id.toString()) } as any,
//       });

//       if (user) {
//         user.number_of_orders = Math.max((user.number_of_orders || 0) - 1, 0);
//         await userRepo.save(user);
//       }
//     }

//     return order;
//   }
  
//   protected override async deletePostProcess(
//     order: OrderEntity
//   ): Promise<OrderEntity> {
//     // Perform any operations after deletion
//     // For example: send notification, update analytics, etc.
//     console.log(`Order ${order._id} deleted successfully`);
    
//     return order;
//   }


}
