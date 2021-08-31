import { District, ListResponse } from 'models';
import axiosClient from './axiosClient';

const districtApi = {
  getByCodeProvince(codeProvince: string): Promise<ListResponse<District>> {
    const url = `/districts?province=${codeProvince}`;
    return axiosClient.get(url);
  },
};

export default districtApi;
