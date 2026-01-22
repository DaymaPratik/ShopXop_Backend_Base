export class UserAuthProviderModel {
  user_id!: number;
  provider: "GOOGLE" | "APPLE" | "FACEBOOK" = "GOOGLE";
  provider_user_id?: string;
  email: string = "";
  password?: string;
  access_token?: string;
}
