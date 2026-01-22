import { ENABLE_ENCRYPTION, NON_ENCRYPTION_ENDPOINTS } from "./config";
import { EncryptionAndDecryption } from "./EncryptionAndDecryption";

export class GenericResponse<T = any> {
  private status: string;
  private error: string | null;
  private details: T;
  private msg: string;
  private totalRecords: number;

  setStatus(status: string) {
    this.status = status;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setMsg(msg: string) {
    this.msg = msg;
  }

  setData(data: T, url?: string) {
    if (
      ENABLE_ENCRYPTION &&
      data &&
      url &&
      !NON_ENCRYPTION_ENDPOINTS.some((e) => url.includes(e))
    ) {
      this.details = EncryptionAndDecryption.encryption(data) as any;
    } else {
      this.details = data;
    }
  }

  setTotalRecords(total: number) {
    this.totalRecords = total;
  }
}
