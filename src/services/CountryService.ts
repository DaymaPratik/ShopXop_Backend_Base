import { BaseService } from "../services/BaseService";
import { CountryEntity } from "../entity/CountryEntity";
import { CountryDTO } from "../databse/repository/country/country.dto";


export class CountryService extends BaseService<CountryEntity> {
  constructor() {
    super(CountryEntity);
  }

  getDTO() {
    return CountryDTO;
  }

}
