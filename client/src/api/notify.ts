import { Filter } from 'models';
import axiosClient from './axiosClient';

export const notifyApi = {
  get: (params: Filter): Promise<any> => {
    const url = '/notify';
    return axiosClient.get(url, { params });
  },
  read: (notifyId: string): Promise<any> => {
    const url = `/notify/read/${notifyId}`;
    return axiosClient.patch(url);
  },
  readAll: () => {
    const url = '/notify/read-all';
    return axiosClient.patch(url);
  },
};
