import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { BaseService } from "../services/BaseService";
import { StatusCode, ResponseStatus } from "../core/config";
import { GenericResponse } from "../core/GenericResponse";
import { Pagination } from "../core/ShopXopParams";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { ErrorCodeApiError } from "../core/ErrorCodeApiError";

export abstract class BaseController<
  TService extends BaseService<any>
> {
  public router = express.Router();
  protected service: TService;
  protected path: string;
  protected dto: any;

  protected constructor(path: string, service: TService) {
    this.path = path;
    this.service = service;
    this.dto = this.service.getDTO?.() || null;

    this._initialiseRoutes();
  }


  protected _initialiseRoutes(): void {
    console.log(this.path);

    this.router.post(`${this.path}/getall`, authMiddleware, this.getAll);
    this.router.post(`${this.path}/getdata`, authMiddleware, this.getData);
    this.router.get(`${this.path}/getbyid/:id`, authMiddleware, this.getById);
    this.router.post(`${this.path}/getdatabyid`, authMiddleware, this.getDataById);
    this.router.post( `${this.path}/save`,authMiddleware,...(this.dto ? [validationMiddleware(this.dto)] : []),this.save);
    this.router.post(`${this.path}/savemulti`,authMiddleware, ...(this.dto ? [validationMiddleware(this.dto)] : []),this.saveMulti);
    this.router.delete(`${this.path}/delete`,authMiddleware,this.delete);
    this.router.post(`${this.path}/updateDeleteFlagData`,authMiddleware,this.updateDeleteFlagData);
    this.router.get(`${this.path}/all`,authMiddleware,this.getAllWithoutPagination);
  }

  protected getAllWithoutPagination = async (req: Request,res: Response) => {
  try {
    const records = await this.service.getAllWithoutPagination();

      this.sendResponse(
        req,
        res,
        StatusCode.SUCCESS,
        "Fetched successfully",
        records,
        records.length
      );
  } catch (error) {
    this.sendError(res, error);
  }
};

  protected prepareParams(param: Pagination, req: Request): Pagination {
    param.pageNumber = req.body.pageNumber ?? 0;
    param.pageSize = req.body.pageSize ?? 25;
    param.filter = req.body.filter ?? {};
    param.filter.search = req.body.search?.trim() ?? "";
    return param;
  }

  protected prepareQueryParams(param: Pagination, req: Request): Pagination {
    return req.body as Pagination;
  }


  protected getAll = async (req: Request, res: Response) => {
    try {
      const param = this.prepareParams(new Pagination(), req);
      const data = await this.service.getAll(param);

      this.sendResponse(
        req,
        res,
        StatusCode.SUCCESS,
        "Fetched successfully",
        data.records,
        data.totalRecords
      );
    } catch (error) {
      this.sendError(res, error);
    }
  };

  protected getData = async (req: Request, res: Response) => {
    try {
      const param = this.prepareQueryParams(new Pagination(), req);
      const data = await this.service.getData(param);

      this.sendResponse(
        req,
        res,
        StatusCode.SUCCESS,
        "Fetched successfully",
        data.records,
        data.totalRecords
      );
    } catch (error) {
      this.sendError(res, error);
    }
  };

  protected getDataById = async (req: Request, res: Response) => {
    try {
      const param = this.prepareQueryParams(new Pagination(), req);
      const data = await this.service.getDataById(param);

      this.sendResponse(
        req,
        res,
        StatusCode.SUCCESS,
        "Fetched successfully",
        data
      );
    } catch (error) {
      this.sendError(res, error);
    }
  };

  protected getById = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getDataById(+req.params.id);

      this.sendResponse(
        req,
        res,
        StatusCode.SUCCESS,
        "Fetched successfully",
        data
      );
    } catch (error) {
      this.sendError(res, error);
    }
  };

protected save = async (req: Request, res: Response) => {
  try {
    const data = await this.service.createRecord(
      req.body,
      null 
    );

    this.sendResponse(
      req,
      res,
      StatusCode.SUCCESS,
      "Saved successfully",
      data
    );
  } catch (error) {
    this.sendError(res, error);
  }
};

  protected saveMulti = async (req: Request, res: Response) => {
    try {
      const data = await this.service.saveMulti(req.body);

      this.sendResponse(
        req,
        res,
        StatusCode.SUCCESS,
        "Saved successfully",
        data
      );
    } catch (error) {
      throw new ErrorCodeApiError("E10008");
    }
  };



protected delete = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return this.sendResponse(
        req,
        res,
        StatusCode.FAILURE,
        "ID is required",
        { error: "Missing ID in request body" }
      );
    }
    
    const numericId = Number(id);
    if (typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      await this.service.delete(id as any);
    } else if (!isNaN(numericId)) {
      await this.service.delete(numericId);
    } else {
      return this.sendResponse(
        req,
        res,
        StatusCode.FAILURE,
        "Invalid ID format",
        { error: "ID must be a valid number or MongoDB ObjectId" }
      );
    }
    
    this.sendResponse(
      req,
      res,
      StatusCode.SUCCESS,
      "Deleted successfully",
      null
    );
    
  } catch (error: any) {
    if (error instanceof ErrorCodeApiError) {
      return this.sendResponse(
        req,
        res,
        StatusCode.FAILURE,
        error.message || "Delete failed",
        { errorCode: error.errorCode }
      );
    }
    if (error.message.includes("Cast to ObjectId failed") || 
        error.message.includes("ObjectId")) {
      return this.sendResponse(
        req,
        res,
        StatusCode.FAILURE,
        "Invalid MongoDB ObjectId format",
        { error: "The provided ID is not a valid MongoDB ObjectId" }
      );
    }
    return this.sendResponse(
      req,
      res,
      StatusCode.FAILURE,
      "Failed to delete record",
      { 
        error: error.message || "Unknown error",
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    );
  }
};


  protected updateDeleteFlagData = async (req: Request, res: Response) => {
    try {
      const success = await this.service.updateDeleteFlagData(req.body);

      if (!success) {
        throw new Error("Update delete flag failed");
      }

      this.sendResponse(
        req,
        res,
        StatusCode.SUCCESS,
        "Updated successfully",
        null
      );
    } catch (error) {
     throw new ErrorCodeApiError("E10008");
    }
  };


  protected sendResponse(
    req: Request,
    res: Response,
    status: string,
    message: string,
    data: any,
    totalRecords: number = 0
  ) {
    const response = new GenericResponse();
    response.setStatus(status);
    response.setMsg(message);
    response.setData(data, req.originalUrl);
    response.setTotalRecords?.(totalRecords);

    res.status(ResponseStatus.SUCCESS).json(response);
  }

  protected sendError(res: Response, error: any) {
    const response = new GenericResponse();
    response.setStatus(StatusCode.FAILURE);
    response.setMsg("Operation failed");
    response.setError(error?.message || error);

    res
      .status(ResponseStatus.INTERNAL_ERROR)
      .json(response);
  }
}

