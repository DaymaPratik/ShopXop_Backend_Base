import {
  Entity,
  Column,
  CreateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";
import { BaseEntity } from "./BaseEntity";

@Entity("orders")
export class OrderEntity extends BaseEntity {
  @Column()
  order_id: string;

  @Column()
  order_details: string;

  @Column()
  amount: number;

  @Column()
  user_id: ObjectId; 

  @Column({ default: false })
  is_delete: boolean;

  @CreateDateColumn()
  created_at: Date;
}
