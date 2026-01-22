import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
  FACEBOOK = "FACEBOOK",
}

@Entity("user_auth_providers")
export class UserAuthProviderEntity extends BaseEntity {

  @Column()
  user_id: number;

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

  @Column({ nullable: true })
  access_token?: string;
}
