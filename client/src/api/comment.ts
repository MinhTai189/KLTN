import {
  Comment,
  Filter,
  ListResponse,
  ReplingComment,
  Response,
} from 'models';
import axiosClient from './axiosClient';

const commentApi = {
  get: (params: Filter): Promise<ListResponse<Comment>> => {
    const url = '/comments';
    return axiosClient.get(url, { params });
  },
  getSubcomment: (
    commentId: string,
    params: Filter
  ): Promise<ListResponse<ReplingComment>> => {
    const url = `/comments/${commentId}`;
    return axiosClient.get(url, { params });
  },
  add: (postId: string, content: string): Promise<Response<any>> => {
    const url = `/comments/${postId}`;
    return axiosClient.post(url, { content });
  },
  addReply: (
    postId: string,
    content: string,
    commentId: string,
    userId: string
  ) => {
    const url = `/comments/${postId}`;
    return axiosClient.post(url, { content, commentId, userId });
  },
  remove: (commentId: string): Promise<any> => {
    const url = `/comments/${commentId}`;
    return axiosClient.delete(url);
  },
  like: (commentId: string, type: number): Promise<Response<any>> => {
    const url = `/comments/likes/${commentId}`;
    return axiosClient.post(url, { params: { type } });
  },
  unlike: (commentId: string): Promise<Response<any>> => {
    const url = `/comments/likes/${commentId}`;
    return axiosClient.delete(url);
  },
  report: (commentId: string, content: string): Promise<any> => {
    const url = 'comments/reports';
    return axiosClient.post(url, { commentId, content });
  },
};

export default commentApi;
