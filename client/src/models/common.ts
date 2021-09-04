export interface Response<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export interface ListResponse<T> {
  success?: boolean;
  message?: string;
  data: Array<T>;
}
