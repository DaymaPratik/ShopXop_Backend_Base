import { IsNotEmpty, IsString } from "class-validator";

export class CountryDTO {
  @IsString()
  @IsNotEmpty()
  country_name: string;

  @IsString()
  @IsNotEmpty()
  country_code: string; // +91, +1

  @IsString()
  @IsNotEmpty()
  country_flag: string; // IN, US
}