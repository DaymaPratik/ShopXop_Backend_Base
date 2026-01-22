import {
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

export abstract class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  is_delete: boolean = false;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;




}
