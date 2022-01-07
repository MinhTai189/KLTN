import {
  DropdownList,
  Filter,
  ListResponse,
  Motel,
  MotelOnly,
  Response,
  Room,
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
  getMotelRandom: (params: Filter): Promise<ListResponse<Motel>> => {
    const url = '/motels/randoms';
    return axiosClient.get(url, { params });
  },
  getMotelById: (id: string): Promise<Response<Motel>> => {
    const url = `/motels/${id}`;
    return axiosClient.get(url);
  },
  addMotel: (params: Motel): Promise<Response<any>> => {
    const url = '/motels';
    return axiosClient.post(url, params);
  },
  updateMotel: (data: MotelOnly): Promise<any> => {
    const url = `/motels/${data._id}`;
    return axiosClient.patch(url, data);
  },
  removeMotel: (id: string): Promise<any> => {
    const url = `/motels/${id}`;
    return axiosClient.delete(url);
  },
  updateRoom: (data: Room): Promise<any> => {
    const url = `/motels/room/${data.motelId}/${data._id}`;
    return axiosClient.patch(url, data);
  },
  removeRoom: (motelId: string, roomId: string): Promise<any> => {
    const url = `/motels/room/${motelId}/${roomId}`;
    return axiosClient.delete(url);
  },
  getListSchoolDropdown: (): Promise<ListResponse<DropdownList>> => {
    const url = '/motels/schools';
    return axiosClient.get(url);
  },
};
