import { BaseService } from "../services/BaseService";
import { UserAuthProviderEntity } from "../entity/UserAuthProviderEntity";
import { UserAuthProviderDto } from "../databse/repository/UserAuthProvider/UserAuthProvider.dto";

export class UserAuthProviderService extends BaseService<UserAuthProviderEntity> {
  constructor() {
    super(UserAuthProviderEntity);
  }

  getDTO() {
    return UserAuthProviderDto;
  }



}
