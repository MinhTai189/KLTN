import {
  Filter,
  ListResponse,
  Motel,
  Response,
  SchoolDropdown,
  MotelOnly,
} from 'models';
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
  updateMotel: (params: MotelOnly): Promise<any> => {
    const url = `/motels/${params._id}`;
    return axiosClient.patch(url, { params });
  },
  removeMotel: (id: string): Promise<any> => {
    const url = `/motels/${id}`;
    return axiosClient.delete(url);
  },
  getDropdownList: (): Promise<ListResponse<SchoolDropdown>> => {
    const url = '/motels/schools';
    return axiosClient.get(url);
  },
};
