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
  update: (params: any): Promise<any> => {
    const url = '/posts';
    return axiosClient.patch(url, params);
  },
  remove: (postId: string): Promise<any> => {
    const url = `/posts/${postId}`;
    return axiosClient.delete(url);
  },
  like: (postId: string, type: number): Promise<Response<any>> => {
    const url = `/posts/likes/${postId}`;
    return axiosClient.post(url, { params: { type } });
  },
  unlike: (postId: string): Promise<Response<any>> => {
    const url = `/posts/likes/${postId}`;
    return axiosClient.delete(url);
  },
  report: (postId: string, content: string): Promise<any> => {
    const url = 'posts/reports';
    return axiosClient.post(url, { postId, content });
  },
};

export default postApi;
