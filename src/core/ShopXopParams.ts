
export class ShopXopParams {
  id?: string | null = null;
}


export class ShopXopFilter {
  search?: string = "";
  isActive?: boolean;
  status?: string;
  startDate?: string;
  endDate?: string;
}


 
export class Pagination extends ShopXopParams {
  pageSize: number = 25;
  pageNumber: number = 1;
  filter: ShopXopFilter = {};
  sortBy?: string;
  sortType?: "asc" | "desc";
  search:string='';
}
