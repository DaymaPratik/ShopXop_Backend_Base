// src/entities/Country.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: "countries" })
export class CountryEntity extends BaseEntity {
   @Column({ type: "varchar", length: 100, unique: true })
  country_name: string;

  @Column({ type: "varchar", length: 10, unique: true })
  country_code: string; 

  @Column({ type: "varchar", length: 10, unique: true })
  country_flag: string; 

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
