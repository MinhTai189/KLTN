import { Filter, ListResponse, Response, UserUpdate } from 'models';
import { User } from 'react-easy-facebook/dist/types';
import axiosClient from './axiosClient';

export const userApi = {
  getAllUser: (): Promise<ListResponse<User>> => {
    const url = '/users';
    return axiosClient.get(url);
  },
  getUser: (params: Filter): Promise<ListResponse<User>> => {
    const url = '/users';
    return axiosClient.get(url, { params });
  },
  removeUser: (id: string): Promise<any> => {
    const url = `/users/${id}`;
    return axiosClient.delete(url);
  },
  updateUser: (data: any, id: string): Promise<any> => {
    const url = `/users/${id}`;
    return axiosClient.patch(url, data);
  },
};
