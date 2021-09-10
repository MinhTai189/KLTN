import { ListResponse, School } from 'models';
import axiosClient from './axiosClient';

const schoolApi = {
  getAll(): Promise<ListResponse<School>> {
    const url = '/schools';
    return axiosClient.get(url);
  },
  getByProDis(
    province: string,
    district: string
  ): Promise<ListResponse<School>> {
    const url = `/schools?province=${province}&district=${district}`;
    return axiosClient.get(url);
  },
};

export default schoolApi;
