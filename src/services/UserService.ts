import { BaseService } from "./BaseService";
import { UserEntity } from "../entity/UserEntity";
import { EncryptionAndDecryption } from "../core/EncryptionAndDecryption";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, JWT_EXP } from "../core/config";
import { UserDto } from "../databse/repository/user/user.dto";
import { ErrorCodeApiError } from "../core/ErrorCodeApiError";

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

  public forgotPassword = async (payload: {
    email?: string;
    phone?: string;
  }): Promise<{ message: string }> => {
    if (!payload.email && !payload.phone) {
       throw new ErrorCodeApiError("E10029"); 
    }

    const user = await this.repository.findOne({
      where: {
        is_delete: false,
        ...(payload.email ? { email: payload.email } : {}),
        ...(payload.phone ? { phone: payload.phone } : {}),
      } as any,
    });

    if (!user) {
      throw new ErrorCodeApiError("E10028"); 
    }
    const otp = this.generateOTP();
    const hashedOtp = await EncryptionAndDecryption.saltEncryption(otp);

    user.otp = hashedOtp;
    user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000); 
     await this.repository.updateOne(
    { _id: user._id },
    {
      $set: {
        otp: hashedOtp,
        otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    }
  );
    if (user.email) {
      console.log(`Email OTP sent to ${user.email}: ${otp}`);
    }
    if (user.phone) {
      console.log(`SMS OTP sent to ${user.phone}: ${otp}`);
    }

    return { message: "OTP sent successfully" };
  };


  public resetPassword = async (payload: {
    email?: string;
    phone?: string;
    otp: string;
    new_password: string;
  }): Promise<{ message: string }> => {
    if (!payload.email && !payload.phone) {
      throw new Error("Email or phone is required");
    }

    const user = await this.repository.findOne({
      where: {
        is_delete: false,
        ...(payload.email ? { email: payload.email } : {}),
        ...(payload.phone ? { phone: payload.phone } : {}),
      } as any,
    });

    if (!user || !user.otp || !user.otp_expiry) {
      throw new ErrorCodeApiError("E10016");
    }

    if (user.otp_expiry < new Date()) {
       throw new ErrorCodeApiError("E10030");
    }

    const isOtpValid = await EncryptionAndDecryption.saltCompare(
      payload.otp,
      user.otp
    );

    if (!isOtpValid) {
      throw new ErrorCodeApiError("E10042");
    }

    const hashedPassword = await EncryptionAndDecryption.saltEncryption(
      payload.new_password
    );

    user.password = hashedPassword;
    user.otp = null;
    user.otp_expiry = null;
    user.password_reset_at = new Date();

     await this.repository.updateOne(
    { _id: user._id },
    {
      $set: {
        password: hashedPassword,
        password_reset_at: new Date(),
      },
      $unset: {
        otp: "",
        otp_expiry: "",
      },
    }
  );

    return { message: "Password reset successfully" };
  };




async register(data: any) {
  const existingUser = await this.repository.findOne({
    where: {
      $or: [
        { email: data.email },
        { phone: data.phone }
      ],
      is_delete: false,
    } as any,
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new ErrorCodeApiError("E10014");
    }
    if (existingUser.phone === data.phone) {
      throw new ErrorCodeApiError("E10036"); 
    }
  }

  data.password = await EncryptionAndDecryption.saltEncryption(
    data.password
  );

  return this.save(data);
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

