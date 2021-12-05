import axiosClient from './axiosClient';

export const notifyApi = {
  read: (notifyId: string): Promise<any> => {
    const url = `/notify/read/${notifyId}`;
    return axiosClient.patch(url);
  },
  readAll: () => {
    const url = '/notify/read-all';
    return axiosClient.patch(url);
  },
};
