// import { Entity, Column} from "typeorm";
// import { BaseEntity } from "./BaseEntity";
// import { ObjectId } from "typeorm";

// export enum AuthProvider {
//   GOOGLE = "GOOGLE",
//   APPLE = "APPLE",
//   FACEBOOK = "FACEBOOK",
//   PASSWORD="PASSWORD"
// }

// @Entity("user_auth_providers")
// export class UserAuthProviderEntity extends BaseEntity {

//   @Column()
//   user_id: ObjectId;

//   @Column({
//     type: "enum",
//     enum: AuthProvider,
//   })
//   provider: AuthProvider;

//   @Column({ nullable: true })
//   provider_user_id?: string;

//   @Column()
//   email: string;

//   @Column({ nullable: true })
//   password?: string;

//   @Column({ nullable: true })
//   access_token?: string;

//   @Column({ type: 'timestamp', nullable: true })
//   access_token_expires_at?: Date;
// }
import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ObjectId } from "mongodb";

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
  FACEBOOK = "FACEBOOK",
  PASSWORD = "PASSWORD",
}

@Entity("user_auth_providers")
export class UserAuthProviderEntity extends BaseEntity {

  @Column()
  user_id: ObjectId;

  @Column({
    type: "enum",
    enum: AuthProvider,
  })
  provider: AuthProvider;

  @Column({ nullable: true })
  provider_user_id?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  // 🔐 JWT
  @Column({ nullable: true })
  access_token?: string;

  @Column({ type: "timestamp", nullable: true })
  access_token_expires_at?: Date;

  // 🔢 OTP fields (NEW)
  @Column({ nullable: true })
  otp?: string;

  @Column({ type: "timestamp", nullable: true })
  otp_expiry?: Date;

  // 🚫 Security / rate-limit
  @Column({ default: 0 })
  otp_attempts?: number;

  @Column({ type: "timestamp", nullable: true })
  otp_block_until?: Date;

  // 🔁 Audit
  @Column({ type: "timestamp", nullable: true })
  password_reset_at?: Date;
}
