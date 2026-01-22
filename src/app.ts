import express from "express";
import Database from "./databse/databse";
import {
  ENABLE_ENCRYPTION,
  NON_ENCRYPTION_ENDPOINTS,
  PATH,
  StatusCode,
} from "./core/config";
import { BaseController } from "./controller/BaseController";
import {
  ApiError,
  BadRequestError,
  MethodNotFoundError,
  NotFoundError,
} from "./core/ApiError";
import multer from "multer";
import helmet from "helmet";
import { EncryptionAndDecryption } from "./core/EncryptionAndDecryption";
import cors from "cors";

export class App {
  public app: express.Application;
  public port: number;

  private pathList: { path: string; method: string }[] = [];
  private database = Database.getInstance();

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  /**
   * Application bootstrap
   */
  public async init(controllers: BaseController<any>[]) {
    await this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  /**
   * MongoDB / TypeORM Mongo connection
   */
  private async initializeDatabase() {
    await this.database.connectToDB();
  }

  /**
   * Global middlewares
   */
  private initializeMiddlewares() {
    this.app.use(express.json({ limit: "100mb" }));
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(
      multer({
        limits: { fileSize: 50 * 1024 * 1024 },
      }).any()
    );

    this.app.use(cors());
    this.app.use(helmet());

    /**
     * 🔐 Encryption / Decryption middleware
     */
    this.app.use((req, res, next): any => {
      if (
        ENABLE_ENCRYPTION &&
        !NON_ENCRYPTION_ENDPOINTS.includes(req.url) &&
        !req.url.includes("/importExcel") &&
        !req.url.includes("/upload") &&
        req.method === "POST"
      ) {
        let result: any = null;

        if (
          req.url.includes("/getall") ||
          req.url.includes("/getdata") ||
          req.url.includes("/getMasterCount")
        ) {
          if (req.body?.details !== undefined) {
            result = EncryptionAndDecryption.decryption(req.body.details);
            if (result === StatusCode.INVALID_ENCRYPTED_INPUT) {
              return ApiError.handle(
                new BadRequestError("Invalid Encrypted String"),
                res
              );
            }
            req.body = result;
          }
        } else {
          result = EncryptionAndDecryption.decryption(req.body.details);
          if (result === StatusCode.INVALID_ENCRYPTED_INPUT) {
            return ApiError.handle(
              new BadRequestError("Invalid Encrypted String"),
              res
            );
          }
          req.body = result;
        }
      }

      next();
    });
  }

  /**
   * Register controllers & route list
   */
  private initializeControllers(controllers: BaseController<any>[]) {
    controllers.forEach((controller) => {
      controller.router.stack.forEach((stack: any) => {
        if (!stack.route) return;

        const fullPath = PATH + stack.route.path;
        const method = stack.route.stack[0]?.method?.toUpperCase();

        if (method) {
          this.pathList.push({
            path: fullPath,
            method,
          });
        }
      });

      this.app.use(PATH, controller.router);
    });
  }

  /**
   * Global error handling
   */
  private initializeErrorHandling() {
    this.app.use((req, res): any => {
      for (const val of this.pathList) {
        if (req.path === val.path && req.method !== val.method) {
          return ApiError.handle(new MethodNotFoundError(), res);
        }
      }
      return ApiError.handle(new NotFoundError(), res);
    });
  }

  /**
   * Start server
   */
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on port ${this.port}`);
    });
  }
}
