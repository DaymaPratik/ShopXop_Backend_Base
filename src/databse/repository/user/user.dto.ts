import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  IsOptional,
  IsEnum,
  Length
} from "class-validator";
import { Transform } from "class-transformer";
import { UserStatus, UserType } from "../../../entity/UserEntity";

export class UserDto {

  @IsOptional()
  id?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: "User name is required" })
  user_name!: string;

  @Transform(({ value }) => value?.trim())
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty()
  email!: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: "Mobile number must be a valid 10-digit Indian number",
  })
  mobile_number!: string;

  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsEnum(UserType)
  user_type!: UserType;

  @IsEnum(UserStatus)
  status!: UserStatus;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  zip_code!: string;

  @IsString()
  country_id!: string;
}



export class RegisterUserDto {
  @IsString()
  user_name: string;

  @IsEmail()
  email: string;

  @IsString()
  mobile_number: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  provider?: string;

  @IsOptional()
  provider_user_id?: string;

  @IsOptional()
  access_token?: string;

  @IsString()
  city: string;

  @IsString()
  zip_code: string;

  @IsString()
  country_id: string; 

   @IsOptional()
  @IsString()
  profile_image?: string;

   @IsEnum(UserType)
  user_type!: UserType;

   @IsEnum(UserStatus)
  status!: UserStatus;
}



export class LoginUserDto {

  @Transform(({ value }) => value?.trim())
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @Length(8, 30, {
    message: "Password must be between 8 and 30 characters",
  })
  password!: string;
}
