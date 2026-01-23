import { BaseService } from "./BaseService";
import { UserEntity } from "../entity/UserEntity";
import { UserAuthProviderEntity } from "../entity/UserAuthProviderEntity";
import { EncryptionAndDecryption } from "../core/EncryptionAndDecryption";
import { ErrorCodeApiError } from "../core/ErrorCodeApiError";
import { UserDto } from "../databse/repository/user/user.dto";
import { ObjectId } from "mongodb";
import { createjwt } from "../core/jwt";
import { EmailService } from "./EmailService";

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

  private async sendForgotPasswordEmail(email: string, otp: string) {
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Shopxop – Password Reset</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#146ef5; padding:24px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">Shopxop</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px; color:#333;">
              <p style="font-size:16px;">Hi <strong>User</strong>,</p>
              <p style="font-size:15px; line-height:1.6;">
                We received a request to reset your <strong>Shopxop</strong> account password.
              </p>

              <div style="text-align:center; margin:32px 0;">
                <div style="
                  display:inline-block;
                  background:#f1f5ff;
                  border:2px dashed #146ef5;
                  padding:16px 32px;
                  border-radius:10px;
                  font-size:30px;
                  font-weight:bold;
                  letter-spacing:6px;
                  color:#146ef5;">
                  {{OTP}}
                </div>
              </div>

              <p style="font-size:14px; color:#555;">
                ⏳ This OTP is valid for <strong>5 minutes</strong>.
              </p>

              <p style="font-size:14px; color:#555;">
                If you didn’t request this, you can safely ignore this email.
              </p>

              <p style="margin-top:32px; font-size:14px;">
                Regards,<br /><strong>Shopxop Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#999;">
              © 2026 Shopxop. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    await EmailService.sendEmail({
      email,
      subject: "Shopxop – Password Reset OTP",
      html: htmlTemplate.replace(/{{OTP}}/g, otp),
    });
  }

  public forgotPassword = async (payload: {
    email?: string;
    phone?: string;
  }): Promise<{ message: string }> => {

    if (!payload.email && !payload.phone) {
      throw new ErrorCodeApiError("E10029");
    }

    const authProviderRepo =
      this.repository.manager.getMongoRepository(UserAuthProviderEntity);

    const authProvider = await authProviderRepo.findOne({
      where: {
        is_deleted: 0,
        ...(payload.email ? { email: payload.email } : {}),
      } as any,
    });

    if (!authProvider) {
      throw new ErrorCodeApiError("E10028");
    }

    const attempts = authProvider.otp_attempts || 0;

    if (attempts >= 2) {
      await authProviderRepo.update(
        { _id: authProvider._id } as any,
        {
          otp_block_until: new Date(Date.now() + 15 * 60 * 1000),
          otp_attempts: 0,
        }
      );
      throw new ErrorCodeApiError("E10008");
    }

    const otp = this.generateOTP();
    const hashedOtp = await EncryptionAndDecryption.saltEncryption(otp);

    await authProviderRepo.update(
      { _id: authProvider._id } as any,
      {
        otp: hashedOtp,
        otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
        otp_attempts: attempts + 1,
      }
    );

    try {
      await this.sendForgotPasswordEmail(authProvider.email, otp);
    } catch (err) {
      console.error("OTP email failed:", err);
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
      throw new ErrorCodeApiError("E10029");
    }

    const authProviderRepo =
      this.repository.manager.getMongoRepository(UserAuthProviderEntity);

    const authProvider = await authProviderRepo.findOne({
      where: {
        is_deleted: 0,
        ...(payload.email ? { email: payload.email } : {}),
      } as any,
    });

    if (!authProvider || !authProvider.otp || !authProvider.otp_expiry) {
      throw new ErrorCodeApiError("E10016");
    }

    if (new Date() > new Date(authProvider.otp_expiry)) {
      throw new ErrorCodeApiError("E10030");
    }

    const isValid = await EncryptionAndDecryption.saltCompare(
      payload.otp,
      authProvider.otp
    );

    if (!isValid) {
      throw new ErrorCodeApiError("E10042");
    }

    await authProviderRepo.update(
      { _id: authProvider._id } as any,
      {
        password: await EncryptionAndDecryption.saltEncryption(payload.new_password),
        password_reset_at: new Date(),
        otp: null,
        otp_expiry: null,
        otp_attempts: 0,
        otp_block_until: null,
      }
    );

    return { message: "Password reset successfully" };
  };

  async login(payload: { email: string; password: string }) {
    const authProviderRepo =
      this.repository.manager.getMongoRepository(UserAuthProviderEntity);

    const authProvider = await authProviderRepo.findOne({
      where: { email: payload.email, is_deleted: 0 } as any,
    });

    if (!authProvider) {
      throw new ErrorCodeApiError("E10015");
    }

    const match = await EncryptionAndDecryption.saltCompare(
      payload.password,
      authProvider.password
    );

    if (!match) {
      throw new ErrorCodeApiError("E10015");
    }

    const token = createjwt({
      user_id: authProvider.user_id,
      email: authProvider.email,
    });

    await authProviderRepo.update(
      { _id: authProvider._id } as any,
      {
        access_token: token,
        access_token_expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      }
    );

    return { token };
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email, is_delete: 0 } as any,
    });
  }

  public async findAuthProvider(
    userId: ObjectId,
    provider: "GOOGLE" | "FACEBOOK" | "GITHUB" | "LOCAL"
  ): Promise<UserAuthProviderEntity | null> {
    return this.repository.manager
      .getMongoRepository(UserAuthProviderEntity)
      .findOne({
        where: { user_id: userId, provider, is_deleted: 0 } as any,
      });
  }

    async register(data: any) {
   
      const userRepo = this.repository.manager.getMongoRepository(
        this.repository.metadata.target as any
      );
      const authProviderRepo =
        this.repository.manager.getMongoRepository(UserAuthProviderEntity);
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

  }





}

export default UserService;
