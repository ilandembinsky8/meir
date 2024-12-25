

export interface ITopMenuState {
    FullName:string;
    items: any[];
    bigMenuFromLib: { [key: string]: any[]; };
    callScripts: { [key: string]: any[]; };
    searches: { [key: string]: any[]; };
    modelsAndBrands: { [key: string]: any[]; };
    modelsAndBrandsType: { [key: string]: any[]; };
    brands: { [key: string]: any; };
    brandsType: { [key: string]: any; };
    isUpdated: string;
    searchValue: string;
  }
  