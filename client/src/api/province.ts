import { ListResponse, Province } from 'models';
import axiosClient from './axiosClient';

const provinceApi = {
  getAll(): Promise<ListResponse<Province>> {
    const url = '/provinces';
    return axiosClient.get(url);
  },
};

export default provinceApi;
