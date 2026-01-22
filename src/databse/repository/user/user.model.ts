export class UserManagementModel {
  user_name: string = "";
  email: string = "";
  mobile_number: string = "";
  profile_image?: string;
  user_type: string = "USER";
  status: string = "ACTIVE";
  city: string = "";
  zip_code: string = "";
  country_id!: string;
}
