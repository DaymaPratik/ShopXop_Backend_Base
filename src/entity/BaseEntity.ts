// import {
//   ObjectIdColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { ObjectId } from "mongodb";

// export abstract class BaseEntity {
//   @ObjectIdColumn()
//   _id: ObjectId;

//   @Column({ default: 0 })
//   is_deleted: number;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   modified_at: Date;




// }
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

  @Column({ default: 0 })
  is_deleted: number;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
