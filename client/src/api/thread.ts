import { ListResponse } from 'models';
import { Thread } from 'models/Thread';
import axiosClient from './axiosClient';

const threadApi = {
  get: (): Promise<ListResponse<Thread>> => {
    const url = '/subjects';
    return axiosClient.get(url);
  },
};

export default threadApi;
