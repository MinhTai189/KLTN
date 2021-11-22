import { Comment, Filter, ListResponse, Response } from 'models';
import axiosClient from './axiosClient';

const commentApi = {
  get: (params: Filter): Promise<ListResponse<Comment>> => {
    const url = '/comments';
    return axiosClient.get(url, { params });
  },
  like: (commentId: string, type: number): Promise<Response<any>> => {
    const url = `/comments/likes/${commentId}`;
    return axiosClient.post(url, { params: { type } });
  },
  unlike: (commentId: string): Promise<Response<any>> => {
    const url = `/comments/likes/${commentId}`;
    return axiosClient.delete(url);
  },
};

export default commentApi;
