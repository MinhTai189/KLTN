import { Filter, ListResponse } from 'models';
import { Post } from 'models/post';
import axiosClient from './axiosClient';

const postApi = {
  get: (params: Filter): Promise<ListResponse<Post>> => {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },
};

export default postApi;
