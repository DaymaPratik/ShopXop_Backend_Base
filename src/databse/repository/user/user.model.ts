
export class UserManagmentModel {
  first_name: string = "";
  last_name?: string;
  name: string = "";
  email: string = "";
  password: string = "";
  role_id: number;
  phone:string='';
  otp?: string;
  new_password?: string;
  number_of_orders?:number;
}
