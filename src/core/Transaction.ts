import { ShopXopDataSource } from "../databse/data-source";
import { QueryRunner } from "typeorm";

export async function Transaction<T>(
  callback: (queryRunner: QueryRunner) => Promise<T>
): Promise<T> {
  const queryRunner = ShopXopDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await callback(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
