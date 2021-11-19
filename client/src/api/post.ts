import { DataPostFinal } from 'features/posts/components/CreatePost/models/create-post';
import { Filter, ListResponse, Response } from 'models';
import { Post } from 'models/Post';
import axiosClient from './axiosClient';

const postApi = {
  get: (params: Filter): Promise<ListResponse<Post>> => {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },
  getById: (id: string): Promise<Response<Post>> => {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },
  add: (params: DataPostFinal): Promise<any> => {
    const url = '/posts';
    return axiosClient.post(url, params);
  },
  like: (postId: string, type: number): Promise<Response<any>> => {
    const url = `/posts/likes/${postId}`;
    return axiosClient.post(url, { params: { type } });
  },
  unlike: (postId: string): Promise<Response<any>> => {
    const url = `/posts/likes/${postId}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
