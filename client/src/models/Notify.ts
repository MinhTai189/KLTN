import { Notify, Pagination } from 'models';

export interface NotifyResponse {
  notify: Notify[];
  read: number;
  unread: number;
}

export interface ListResponseNotif {
  success?: boolean;
  message?: string;
  data: NotifyResponse;
  pagination: Pagination;
}
