// src/dto/UserAuthProviderDto.ts
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
  IsNumber,
} from "class-validator";
import { Transform } from "class-transformer";
import { AuthProvider } from "../../../entity/UserAuthProviderEntity";

export class UserAuthProviderDto {

  @IsOptional()
  id?: string;

  @IsNumber()
  @IsNotEmpty({ message: "User ID is required" })
  user_id!: number;

  @IsEnum(AuthProvider, {
    message: "Provider must be GOOGLE, APPLE or FACEBOOK",
  })
  provider!: AuthProvider;

  @IsOptional()
  @IsString()
  provider_user_id?: string;

  @Transform(({ value }) => value?.trim())
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  access_token?: string;
}
