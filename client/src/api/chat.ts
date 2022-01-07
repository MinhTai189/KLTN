import { AddGroup } from 'models';
import axiosClient from './axiosClient';

const chatApis = {
  getChatGroup() {
    const url = '/chats/groups';
    return axiosClient.get(url);
  },
  addChatGroup(params: AddGroup): Promise<any> {
    const url = '/chats/groups';
    return axiosClient.post(url, params);
  },
};

export default chatApis;
