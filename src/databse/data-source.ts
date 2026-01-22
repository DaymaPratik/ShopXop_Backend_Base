
import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "../entity/UserEntity";
import { OrderEntity } from "../entity/OrderEntity";
import { CountryEntity } from "../entity/CountryEntity";
import { UserAuthProviderEntity } from "../entity/UserAuthProviderEntity";

export const ShopXopDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGO_URI,
  database: process.env.MONGO_DB,
  // useUnifiedTopology: true,
  synchronize: false, 
  logging: false,
  entities: [
    UserEntity,
    OrderEntity,
    CountryEntity,
    UserAuthProviderEntity
  ],
});









