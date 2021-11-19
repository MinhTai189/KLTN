import { Comment, Filter, ListResponse } from 'models';
import axiosClient from './axiosClient';

const commentApi = {
  get: (params: Filter): Promise<ListResponse<Comment>> => {
    const url = 'comments';
    return axiosClient.get(url, { params });
  },
};

export default commentApi;
