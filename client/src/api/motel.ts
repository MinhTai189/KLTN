import { Filter, ListResponse, Motel, Response } from 'models';
import axiosClient from './axiosClient';

export const motelApi = {
  getAll: (): Promise<ListResponse<Motel>> => {
    const url = '/motels';
    return axiosClient.get(url);
  },
  getMotel: (params: Filter): Promise<ListResponse<Motel>> => {
    const url = '/motels';
    return axiosClient.get(url, { params });
  },
  addMotel: (params: Motel): Promise<Response<any>> => {
    const url = '/motels';
    return axiosClient.post(url, params);
  },
};
