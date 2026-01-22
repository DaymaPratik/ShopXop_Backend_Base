import { BaseService } from "./BaseService";
import { UserEntity } from "../entity/UserEntity";
import { EncryptionAndDecryption } from "../core/EncryptionAndDecryption";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, JWT_EXP } from "../core/config";
import { UserDto } from "../databse/repository/user/user.dto";
import { ErrorCodeApiError } from "../core/ErrorCodeApiError";
import { UserAuthProviderEntity } from "../entity/UserAuthProviderEntity";
import { Transaction } from "../core/Transaction";
import { ObjectId } from "mongodb";

class UserService extends BaseService<UserEntity> {
  constructor() {
    super(UserEntity);
  }
    getDTO() {
    return UserDto;
  }

  public generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

  // public forgotPassword = async (payload: {
  //   email?: string;
  //   phone?: string;
  // }): Promise<{ message: string }> => {
  //   if (!payload.email && !payload.phone) {
  //      throw new ErrorCodeApiError("E10029"); 
  //   }

  //   const user = await this.repository.findOne({
  //     where: {
  //       is_delete: false,
  //       ...(payload.email ? { email: payload.email } : {}),
  //       ...(payload.phone ? { phone: payload.phone } : {}),
  //     } as any,
  //   });

  //   if (!user) {
  //     throw new ErrorCodeApiError("E10028"); 
  //   }
  //   const otp = this.generateOTP();
  //   const hashedOtp = await EncryptionAndDecryption.saltEncryption(otp);

  //   user.otp = hashedOtp;
  //   user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000); 
  //    await this.repository.updateOne(
  //   { _id: user._id },
  //   {
  //     $set: {
  //       otp: hashedOtp,
  //       otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
  //     },
  //   }
  // );
  //   if (user.email) {
  //     console.log(`Email OTP sent to ${user.email}: ${otp}`);
  //   }
  //   if (user.phone) {
  //     console.log(`SMS OTP sent to ${user.phone}: ${otp}`);
  //   }

  //   return { message: "OTP sent successfully" };
  // };


  // public resetPassword = async (payload: {
  //   email?: string;
  //   phone?: string;
  //   otp: string;
  //   new_password: string;
  // }): Promise<{ message: string }> => {
  //   if (!payload.email && !payload.phone) {
  //     throw new Error("Email or phone is required");
  //   }

  //   const user = await this.repository.findOne({
  //     where: {
  //       is_delete: false,
  //       ...(payload.email ? { email: payload.email } : {}),
  //       ...(payload.phone ? { phone: payload.phone } : {}),
  //     } as any,
  //   });

  //   if (!user || !user.otp || !user.otp_expiry) {
  //     throw new ErrorCodeApiError("E10016");
  //   }

  //   if (user.otp_expiry < new Date()) {
  //      throw new ErrorCodeApiError("E10030");
  //   }

  //   const isOtpValid = await EncryptionAndDecryption.saltCompare(
  //     payload.otp,
  //     user.otp
  //   );

  //   if (!isOtpValid) {
  //     throw new ErrorCodeApiError("E10042");
  //   }

  //   const hashedPassword = await EncryptionAndDecryption.saltEncryption(
  //     payload.new_password
  //   );

  //   user.password = hashedPassword;
  //   user.otp = null;
  //   user.otp_expiry = null;
  //   user.password_reset_at = new Date();

  //    await this.repository.updateOne(
  //   { _id: user._id },
  //   {
  //     $set: {
  //       password: hashedPassword,
  //       password_reset_at: new Date(),
  //     },
  //     $unset: {
  //       otp: "",
  //       otp_expiry: "",
  //     },
  //   }
  // );

  //   return { message: "Password reset successfully" };
  // };







  async register(data: any) {
    return Transaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getMongoRepository(
        this.repository.metadata.target as any
      );
      const authProviderRepo =
        queryRunner.manager.getMongoRepository(UserAuthProviderEntity);
      const existingUser = await userRepo.findOne({
        where: {
          $or: [
            { email: data.email },
            { mobile_number: data.mobile_number },
          ],
          is_deleted: 0,
        } as any,
      });

      if (existingUser) {
        if (existingUser.email === data.email) {
          throw new ErrorCodeApiError("E10014"); 
        }
        if (existingUser.mobile_number === data.mobile_number) {
          throw new ErrorCodeApiError("E10036"); 
        }
      }
      let hashedPassword: string | undefined;
      if (data.password) {
        hashedPassword = await EncryptionAndDecryption.saltEncryption(
          data.password
        );
        data.password = hashedPassword;
      }
      const user = userRepo.create({
        user_name: data.user_name,
        email: data.email,
        mobile_number: data.mobile_number,
        city: data.city,
        zip_code: data.zip_code,
        country_id: data.country_id,
        user_type: data.user_type ?? "USER",
        status: "ACTIVE",
      });

      const savedUser = await userRepo.save(user);
      const authProvider = authProviderRepo.create({
        user_id: savedUser._id,
        provider: data.provider,
        provider_user_id: data.provider_user_id ?? null,
        email: data.email,
        password: hashedPassword ?? null,
        access_token: data.access_token ?? null,
      });

      await authProviderRepo.save(authProvider);
      delete (savedUser as any).password;

      return savedUser;
    });
  }
  async login(payload: { email: string; password: string }) {
    console.log(payload.email)
    const user = await this.repository.findOne({
      where: { email: payload.email, is_delete: false } as any,
    });

    console.log(user)
    if (!user)  throw new ErrorCodeApiError("E10015");

    const match = await EncryptionAndDecryption.saltCompare(
      payload.password,
      (user as any).password
    );

 
    if (!match) throw new ErrorCodeApiError("E10015");

    const token = jwt.sign(
      { id: (user as any).id, email: (user as any).email },
      JWT_SECRET_KEY,
      { expiresIn: JWT_EXP }
    );

    return { token, user };
  }
}

export default UserService;

