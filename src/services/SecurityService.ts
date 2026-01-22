import { BaseService } from "./BaseService";

class SecurityService extends BaseService {
  constructor() {
    super(null);
  }

  getModuleName(): string {
    return "Security";
  }
}

export default SecurityService;
