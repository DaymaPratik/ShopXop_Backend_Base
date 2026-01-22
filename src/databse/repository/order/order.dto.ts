import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class OrderDTO {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  order_details: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  user_id: string; 
}
