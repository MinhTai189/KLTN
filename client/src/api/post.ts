import { DataPostFinal } from 'features/communicate/components/CreatePost/models/create-post';
import { Filter, ListResponse } from 'models';
import { Post } from 'models/post';
import axiosClient from './axiosClient';

const postApi = {
  get: (params: Filter): Promise<ListResponse<Post>> => {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },
  add: (params: DataPostFinal): Promise<any> => {
    const url = '/posts';
    return axiosClient.post(url, params);
  },
};

export default postApi;
