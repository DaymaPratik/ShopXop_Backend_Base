import { DeepPartial, MongoRepository, ObjectLiteral } from "typeorm";
import { ShopXopDataSource } from "../databse/data-source";
import { Pagination } from "../core/ShopXopParams";
import { ObjectId } from "mongodb";
import { Transaction } from "../core/Transaction";
import { ErrorCodeApiError } from "../core/ErrorCodeApiError";
import { QueryRunner } from "typeorm/browser";
import { ShopXopModel } from "../databse/repository/ShopXop/ShopXop.model";
import { FileObject } from "../core/FileModel";

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: MongoRepository<T>;

  protected constructor(entity: new () => T) {
    this.repository = ShopXopDataSource.getMongoRepository(entity);
  }

  abstract getDTO(): any;

  getModuleName(): string {
    return "";
  }

  getGlobalSearchFields(): (keyof T)[] {
    return [];
  }


 
  protected getRepository(
  queryRunner?: QueryRunner
): MongoRepository<T> {

  if (
    queryRunner &&
    queryRunner.isTransactionActive
  ) {
    return queryRunner.manager.getMongoRepository(
      this.repository.metadata.target as any
    );
  }

  // fallback to default repository
  return this.repository;
}


  protected applyPagination(param: Pagination) {
    const pageNumber = param.pageNumber > 0 ? param.pageNumber : 1;
    const pageSize = param.pageSize > 0 ? param.pageSize : 10;

    return {
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    };
  }

  protected applyGlobalSearch(
    records: T[],
    search: string
  ): T[] {
    if (!search) return records;

    const fields = this.getGlobalSearchFields();
    if (!fields.length) return records;

    const text = search.toLowerCase();

    return records.filter((record: any) =>
      fields.some(
        (field) =>
          record[field] &&
          record[field].toString().toLowerCase().includes(text)
      )
    );
  }



  protected async postProcessAfterGetAll(
    records: T[],
    _param: Pagination
  ): Promise<T[]> {
    return records;
  }

  protected async postProcessAfterGetById(
    record: T
  ): Promise<T> {
    return record;
  }



protected async createPreProcess(
  model: DeepPartial<T>,
  files: FileObject[] | null,
  queryRunner?: any
): Promise<DeepPartial<T>> {
  return model;
}

protected async createPostProcess(
  record: T,
  model: DeepPartial<T>,
  files: FileObject[] | null,
  queryRunner?: any
): Promise<T> {
  return record;
}
  protected async updatePreProcess(
    model: Partial<T>
  ): Promise<Partial<T>> {
    return model;
  }




  public getAll = async (param: Pagination) => {
    const pageNumber = param.pageNumber > 0 ? param.pageNumber : 1;
    const pageSize = param.pageSize > 0 ? param.pageSize : 10;

    const [records, totalRecords] =
      await this.repository.findAndCount({
        where: { is_delete: false } as any,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        order: { created_at: "DESC" } as any,
      });

    return { records, totalRecords };
  };

  public getData = async (param: Pagination) => {
    return this.getAll(param);
  };

  public getDataById = async (param: any): Promise<T> => {
    const id = param?.id ?? param;

    if (!id) {
      throw new ErrorCodeApiError("E10031"); 
    }

    const record = await this.repository.findOne({
      where: { id, is_delete: false } as any,
    });

    if (!record) {
      throw new ErrorCodeApiError("E10039"); 
    }

    return record;
  };

  

    public save = async (data: DeepPartial<T>): Promise<T> => {
      return Transaction(async (queryRunner) => {
        const repo = this.getRepository(queryRunner);
        const id = (data as any).id;
        if (id) {
          const objectId = ObjectId.createFromHexString(String(id));

          const existing = await repo.findOne({
            where: { _id: objectId, is_delete: false } as any,
          });

          if (!existing) {
            throw new ErrorCodeApiError("E10039");
          }

          delete (data as any).id;
          Object.assign(existing, data);

          return await repo.save(existing);
        }

        const entity = repo.create(data);
        return await repo.save(entity);
      });
    };


    public async createRecord(
      model: DeepPartial<T>,
      files: FileObject[] | null
    ): Promise<T> {
      return Transaction(async (queryRunner) => {
        model = await this.createPreProcess(model, files, queryRunner);
        let record = await this.save(model);
          // 3️⃣ FILE UPLOAD (OPTIONAL)
          // if (files?.length) {
          //   const uploadResult = await this.uploadFiles(
          //     files,
          //     this.getMetaModel()?.modelName,
          //     this.getMetaModel()?.fileFieldName,
          //     (record as any)._id
          //   );
          //
          //   record = await this.updateFileData(uploadResult, record);
          // }
        record = await this.createPostProcess(record, model, files, queryRunner);
        return record;
      });
    }


  public saveMulti = async (data: DeepPartial<T>[]): Promise<T[]> => {
    return Transaction(async (queryRunner) => {
      const repo = this.getRepository(queryRunner);
      const result: T[] = [];

      for (const item of data) {
        const entity = repo.create(item);
        const saved = await repo.save(entity);
        result.push(saved);
      }

      return result;
    });
  };



public delete = async (id: number | string): Promise<boolean> => {
  return Transaction(async (queryRunner) => {
    const repo = this.getRepository(queryRunner);
    let whereClause: any = { is_delete: false };
  
    if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
      whereClause._id = new ObjectId(id);
    } else if (!isNaN(Number(id))) {
      whereClause.id = Number(id);
    } else {
      throw new ErrorCodeApiError("E10039");
    }
    const record = await repo.findOne({
      where: whereClause,
    });
    if (!record) {
      throw new ErrorCodeApiError("E10039");
    }
    const preProcessedRecord = await this.deletePreProcess(record, queryRunner);
    (preProcessedRecord as any).is_delete = true;
    await repo.save(preProcessedRecord);
    await this.deletePostProcess(preProcessedRecord, queryRunner);
    
    return true;
  });
};


protected async deletePreProcess(record: T, queryRunner?: any): Promise<T> {
  return record;
}

protected async deletePostProcess(record: T, queryRunner?: any): Promise<T> {
  return record;
}
  public updateDeleteFlagData = async (param: any): Promise<boolean> => {
    const ids = Array.isArray(param.id) ? param.id : [param.id];

    if (!ids.length) {
      throw new ErrorCodeApiError("E10032"); 
    }

    await this.repository.updateMany(
      { id: { $in: ids }, is_delete: false } as any,
      { $set: { is_delete: true } } as any
    );

    return true;
  };
}
