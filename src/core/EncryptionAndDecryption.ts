import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";
import { ENCRYPTION_SECRET_KEY, StatusCode, SALT_ROUNDS } from "../core/config";

export class EncryptionAndDecryption {
  private static iv = CryptoJS.enc.Hex.parse(
    "101112131415161718191a1b1c1d1e1f"
  );

  
  public static encryption(body: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(body),
      ENCRYPTION_SECRET_KEY,
      { mode: CryptoJS.mode.CTR, iv: this.iv }
    ).toString();
  }


  public static decryption(body: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(
        body,
        ENCRYPTION_SECRET_KEY,
        { mode: CryptoJS.mode.CTR, iv: this.iv }
      );

      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      return StatusCode.INVALID_ENCRYPTED_INPUT;
    }
  }

  /** Password hashing */
  public static async saltEncryption(data: string): Promise<string> {
    return bcrypt.hash(data, SALT_ROUNDS);
  }

  /** Password comparison */
  public static async saltCompare(
    data: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  /** Encrypt IDs (URL-safe) */
  public static encryptionIds(body: any): string {
    const encStr = CryptoJS.AES.encrypt(
      JSON.stringify(body),
      ENCRYPTION_SECRET_KEY,
      { mode: CryptoJS.mode.CTR, iv: this.iv }
    ).toString();

    return encStr.replace(/\+/g, "-").replace(/\//g, "_");
  }

  /** Decrypt IDs */
  public static decryptionIds(body: string): any {
    try {
      const restored = body.replace(/-/g, "+").replace(/_/g, "/");

      const bytes = CryptoJS.AES.decrypt(
        restored,
        ENCRYPTION_SECRET_KEY,
        { mode: CryptoJS.mode.CTR, iv: this.iv }
      );

      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      return StatusCode.INVALID_ENCRYPTED_INPUT;
    }
  }

  /** Encrypt single field */
  public static encryptField(value?: string): string {
    try {
      if (!value) return "";
      return CryptoJS.AES.encrypt(
        value,
        ENCRYPTION_SECRET_KEY,
        { mode: CryptoJS.mode.CTR }
      ).toString();
    } catch {
      return "";
    }
  }

  /** Decrypt single field */
  public static decryptField(value?: string): string {
    try {
      if (!value) return "";
      return CryptoJS.AES.decrypt(
        value,
        ENCRYPTION_SECRET_KEY,
        { mode: CryptoJS.mode.CTR }
      ).toString(CryptoJS.enc.Utf8);
    } catch {
      return "";
    }
  }
}
