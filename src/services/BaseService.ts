import { DeepPartial, MongoRepository, ObjectLiteral } from "typeorm";
import { ShopXopDataSource } from "../databse/data-source";
import { Pagination } from "../core/ShopXopParams";
import { ObjectId } from "mongodb";
import { ErrorCodeApiError } from "../core/ErrorCodeApiError";
import { FileObject } from "../core/FileModel";

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: MongoRepository<T>;

  protected constructor(entity: new () => T) {
    this.repository = ShopXopDataSource.getMongoRepository(entity);
  }

  abstract getDTO(): any;

  /* -------------------- COMMON HELPERS -------------------- */

  protected applyPagination(param: Pagination) {
    const pageNumber = param.pageNumber > 0 ? param.pageNumber : 1;
    const pageSize = param.pageSize > 0 ? param.pageSize : 10;

    return {
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    };
  }

  public getAllWithoutPagination = async (): Promise<T[]> => {
    return this.repository.find({
      where: { is_deleted: 0 } as any,
      order: { created_at: "ASC" } as any,
    });
  };

  protected applyGlobalSearch(records: T[], search: string): T[] {
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

  getGlobalSearchFields(): (keyof T)[] {
    return [];
  }

  /* -------------------- CRUD -------------------- */

  public getAll = async (param: Pagination) => {
    const { skip, take } = this.applyPagination(param);

    const [records, totalRecords] =
      await this.repository.findAndCount({
        where: { is_deleted: 0 } as any,
        skip,
        take,
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

    const whereClause: any = { is_deleted: 0 };

    if (ObjectId.isValid(id)) {
      whereClause._id = new ObjectId(id);
    } else {
      whereClause.id = id;
    }

    const record = await this.repository.findOne({ where: whereClause });

    if (!record) {
      throw new ErrorCodeApiError("E10039");
    }

    return record;
  };

  /* -------------------- SAVE / CREATE -------------------- */

  public save = async (data: DeepPartial<T>): Promise<T> => {
    const id = (data as any).id;

    if (id && ObjectId.isValid(id)) {
      const existing = await this.repository.findOne({
        where: { _id: new ObjectId(id), is_deleted: 0 } as any,
      });

      if (!existing) {
        throw new ErrorCodeApiError("E10039");
      }

      delete (data as any).id;
      Object.assign(existing, data);
      return await this.repository.save(existing);
    }

    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  };

  public async createRecord(
    model: DeepPartial<T>,
    files: FileObject[] | null
  ): Promise<T> {
    model = await this.createPreProcess(model, files);
    let record = await this.save(model);
    record = await this.createPostProcess(record, model, files);
    return record;
  }

  protected async createPreProcess(
    model: DeepPartial<T>,
    files: FileObject[] | null
  ): Promise<DeepPartial<T>> {
    return model;
  }

  protected async createPostProcess(
    record: T,
    model: DeepPartial<T>,
    files: FileObject[] | null
  ): Promise<T> {
    return record;
  }

  /* -------------------- DELETE -------------------- */

  public delete = async (id: number | string): Promise<boolean> => {
    let whereClause: any = { is_deleted: 0 };

    if (typeof id === "string" && ObjectId.isValid(id)) {
      whereClause._id = new ObjectId(id);
    } else if (!isNaN(Number(id))) {
      whereClause.id = Number(id);
    } else {
      throw new ErrorCodeApiError("E10039");
    }

    const record = await this.repository.findOne({ where: whereClause });

    if (!record) {
      throw new ErrorCodeApiError("E10039");
    }

    (record as any).is_deleted = 1;
    await this.repository.save(record);
    return true;
  };

  /* -------------------- BULK DELETE FLAG -------------------- */

  public updateDeleteFlagData = async (param: any): Promise<boolean> => {
    const ids = Array.isArray(param.id) ? param.id : [param.id];

    if (!ids.length) {
      throw new ErrorCodeApiError("E10032");
    }

    await this.repository.updateMany(
      { _id: { $in: ids.map((id) => new ObjectId(id)) }, is_deleted: 0 } as any,
      { $set: { is_deleted: 1 } } as any
    );

    return true;
  };
}
