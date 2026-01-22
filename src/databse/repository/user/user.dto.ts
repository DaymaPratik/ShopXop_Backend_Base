import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  Length,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Transform } from "class-transformer";

export class UserDto {
@IsOptional()
id:string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: "First Name is required" })
  @Length(3, 100)
  @IsOptional()
  first_name!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString()
  last_name?: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty()
  @IsOptional()
  email!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^[6-9]\d{9}$/, {
    message: "Phone number must be a valid 10-digit Indian number",
  })
  @IsOptional()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 30)
  @IsOptional()
  password!: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  role_id!: number;

  @IsNumber()
  @IsOptional()
  number_of_orders!: number;

  @IsOptional()
  @IsString()
  @Length(6, 6, { message: "OTP must be 6 digits" })
  otp?: string;

  @IsOptional()
  @IsString()
  @Length(8, 30, {
    message: "New password must be between 8 and 30 characters",
  })
  new_password?: string;
}
