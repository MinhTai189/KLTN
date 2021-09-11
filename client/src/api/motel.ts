import { ListResponse, Motel } from 'models';
import axiosClient from './axiosClient';

export const motelApi = {
  getAll: (): Promise<ListResponse<Motel>> => {
    const url = '/motels';
    return axiosClient.get(url);
  },
};
