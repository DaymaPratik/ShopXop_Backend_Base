import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("users")
export class UserEntity extends BaseEntity {

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  name: string;

 @Column({ unique: true })
  phone: string; 

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role_id: number;

  @Column()
  user_type: string;

   @Column()
  number_of_orders: number=0;

  @Column({ nullable: true })
  otp?: string;

  @Column({ nullable: true })
  otp_expiry?: Date;

  
  @Column({ nullable: true })
  password_reset_at?: Date;  

}
