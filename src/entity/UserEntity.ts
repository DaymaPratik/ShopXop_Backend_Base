import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED"
}

export enum UserType {
  BUYER="BUYER",
  SELLER="SELLER"
}


@Entity("users")
export class UserEntity extends BaseEntity {

  @Column({ name: "user_name" })
  user_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "mobile_number", unique: true })
  mobile_number: string;

  @Column({ name: "profile_image", nullable: true })
  profile_image?: string;

  @Column({
    type: "enum",
    enum: UserType,
  })
  user_type: UserType;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;


  @Column()
  city: string;

  @Column()
  zip_code: string;

  @Column()
  country_id: string;
}
