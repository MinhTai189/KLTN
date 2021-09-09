export interface Response<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export interface ListResponse<T> {
  success?: boolean;
  message?: string;
  data: Array<T>;
  pagination: Pagination;
}

export interface Filter {
  _page?: number;
  _limit?: number;
  _order?: string;
  _sort?: string;
  _namelike?: string;
  _school?: string;
  _district?: string;
  _province?: string;
  _role?: boolean;
  _keysearch?: string;

  [key: string]: any;
}

export interface Pagination {
  _page: number;
  _limit: number;
  _totalRows: number;
}

export interface RadioOption {
  value: string;
  label: string;
}
