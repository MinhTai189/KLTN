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
  _school?: string | string[];
  _district?: string;
  _province?: string;
  _role?: string;
  _keysearch?: string;
  _status?: boolean | string;

  [key: string]: any;
}

export interface Pagination {
  _page: number;
  _limit: number;
  _totalRows: number;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface UploadResponse {
  url: string;
  public_id: string;
}
