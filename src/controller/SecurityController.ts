import express, { Request, Response } from "express";
import { APP_ROUTES } from "../core/AppRoutes";
import { EncryptionAndDecryption } from "../core/EncryptionAndDecryption";
import { StatusCode, ResponseStatus } from "../core/config";
import { GenericResponse } from "../core/GenericResponse";


export class SecurityController {
  public router = express.Router();
  public path = APP_ROUTES.SECURITY;

  constructor() {
    this.initializeRoutes();
  }
 

  private initializeRoutes(): void {
    this.router.post(`${this.path}/encryption`, this.encryptData);
    this.router.post(`${this.path}/decryption`, this.decryptData);
    this.router.post(`${this.path}/saltencryption`, this.saltEncryption);
  }

  private encryptData = (req: Request, res: Response) => {
    const encryptedData = EncryptionAndDecryption.encryption(req.body);

    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("Data encrypted successfully");
    response.setData(encryptedData);

    res.status(ResponseStatus.SUCCESS).json(response);
  };

  private decryptData = (req: Request, res: Response) => {
    const decryptedData = EncryptionAndDecryption.decryption(req.body.details);

    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("Data decrypted successfully");
    response.setData(decryptedData);

    res.status(ResponseStatus.SUCCESS).json(response);
  };

  private saltEncryption = async (req: Request, res: Response) => {
    const hashed = await EncryptionAndDecryption.saltEncryption(req.body.data);

    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("Salt encryption successful");
    response.setData(hashed);

    res.status(ResponseStatus.SUCCESS).json(response);
  };
}




