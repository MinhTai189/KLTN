import { ListResponse, Province } from 'models';
import axiosClient from './axiosClent';

const provinceApi = {
  getAll(): Promise<ListResponse<Province>> {
    const url = '/provinces';
    return axiosClient.get(url);
  },
};

export default provinceApi;
