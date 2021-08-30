import { District, ListResponse } from 'models';
import axiosClient from './axiosClent';

const districtApi = {
  getByCodeProvince(codeProvince: string): Promise<ListResponse<District>> {
    const url = `/districts?province=${codeProvince}`;
    return axiosClient.get(url);
  },
};

export default districtApi;
