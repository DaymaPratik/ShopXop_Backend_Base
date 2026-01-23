
import { Request, Response } from "express";
import { APP_ROUTES } from "../core/AppRoutes";
import { BaseController } from "./BaseController";
import UserService from "../services/UserService";
import { GenericResponse } from "../core/GenericResponse";
import { StatusCode, ResponseStatus } from "../core/config";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { RegisterUserDto, UserDto } from "../databse/repository/user/user.dto";
// import { FacebookOAuth } from "./FBOAuthController";
// import { EncryptionAndDecryption } from "../core/EncryptionAndDecryption";
// import crypto from "crypto";
// import { createjwt } from "../core/jwt";
// import { createjwt } from "../core/";

export class UserController extends BaseController<UserService> {
  constructor(
    path: APP_ROUTES = APP_ROUTES.USER,
    service = new UserService()
  ) {
    super(path, service);

    this.router.post(`${this.path}/register`,validationMiddleware(RegisterUserDto), this.register);
    this.router.post(`${this.path}/login`, this.login);
    // this.router.post(`${this.path}/forgot-password`, this.forgotPassword);
    // this.router.post(`${this.path}/reset-password`, this.resetPassword);
  }

    //   protected async facebookAuth(
    //   req: Request,
    //   res: Response
    // ): Promise<void> {
    //   const redirectUri = `${DEV_URL}/infer/api/logins/facebook/callback`;
    //   const state = crypto.randomBytes(16).toString("hex");

    //   const authUrl = FacebookOAuth.getAuthUrl(redirectUri, state);
    //   res.redirect(authUrl);
    // }


    // protected async facebookCallback(
    //   req: Request,
    //   res: Response
    // ): Promise<void> {
    //   try {
    //     const { code, error } = req.query;

    //     if (error || !code) {
    //       throw new Error("Facebook login failed");
    //     }

    //     const redirectUri = `${DEV_URL}/infer/api/logins/facebook/callback`;

    //     const { token, userInfo } =
    //       await FacebookOAuth.completeOAuthFlow(code as string, redirectUri);

    //     let user = await this.service.findByEmail(userInfo.email);

    //     if (!user) {
    //       user = await this.service.register({
    //         user_name: userInfo.name,
    //         email: userInfo.email,
    //         provider: "FACEBOOK",
    //         provider_user_id: userInfo.id,
    //         access_token: token.access_token,
    //       });
    //     } else {
    //       // Check provider conflict
    //       const existingProvider =
    //         await this.service.findAuthProvider(user._id, "FACEBOOK");

    //       if (!existingProvider) {
    //         throw new Error("Email already registered with different provider");
    //       }
    //     }

    //     // STEP 2: generate tokens
    //     const jwtToken = createjwt({
    //       user_id: user._id,
    //       email: user.email,
    //       provider: "FACEBOOK",
    //     });

    //     const encrypted = EncryptionAndDecryption.encryption({
    //       token: jwtToken,
    //       user,
    //     });

    //     const frontendUrl = `${FRONTENDDOMAIN}/signin?token=${encrypted}`;
    //     res.redirect(frontendUrl);

    //   } catch (err: any) {
    //     const encrypted = EncryptionAndDecryption.encryption({
    //       error: err.message,
    //     });
    //     res.redirect(`${FRONTENDDOMAIN}/signin?token=${encrypted}`);
    //   }
    // }

  private register = async (req: Request, res: Response) => {
    const user = await this.service.register(req.body);

    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("User registered successfully");
    response.setData(
      { id: user._id, name: user.name, email: user.email },
      req.originalUrl
    );

    res.status(ResponseStatus.SUCCESS).send(response);
  };

  private login = async (req: Request, res: Response) => {
    const result = await this.service.login(req.body);

    const response = new GenericResponse();
    response.setStatus(StatusCode.SUCCESS);
    response.setMsg("Login successful");
    response.setData(result, req.originalUrl);

    res.status(ResponseStatus.SUCCESS).send(response);
  };

  //   private forgotPassword = async (req: Request, res: Response) => {
  //   const result = await this.service.forgotPassword(req.body);
  //   const response = new GenericResponse();
  //   response.setStatus(StatusCode.SUCCESS);
  //   response.setMsg("OTP sent successfully");
  //   response.setData(result, req.originalUrl);

  //   res.status(ResponseStatus.SUCCESS).send(response);
  // };

  // private resetPassword = async (req: Request, res: Response) => {
  //   const result = await this.service.resetPassword(req.body);
  //   const response = new GenericResponse();
  //   response.setStatus(StatusCode.SUCCESS);
  //   response.setMsg("Password reset successfully");
  //   response.setData(result, req.originalUrl);
  //   res.status(ResponseStatus.SUCCESS).send(response);
  // };

}




