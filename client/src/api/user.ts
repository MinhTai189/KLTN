import { Filter, ListResponse, ProfileUser, Response, User } from 'models';
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
  getUserById: (id: string): Promise<Response<ProfileUser>> => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  removeUser: (id: string): Promise<any> => {
    const url = `/users/${id}`;
    return axiosClient.delete(url);
  },
  updateUser: (data: any, id: string): Promise<any> => {
    const url = `/users/${id}`;
    return axiosClient.patch(url, data);
  },
  likeMotel: (id: string): Promise<any> => {
    const url = `/users/favorites/${id}`;
    return axiosClient.post(url);
  },
  unlikeMotel: (id: string): Promise<any> => {
    const url = `/users/favorites/${id}`;
    return axiosClient.delete(url);
  },
};
