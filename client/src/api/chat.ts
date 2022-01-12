import {
  AddChatMessage,
  AddGroup,
  ChatMessage,
  Filter,
  ListResponse,
} from 'models';
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
  leaveChatGroup(groupId: string): Promise<any> {
    const url = `/chats/groups/${groupId}`;
    return axiosClient.delete(url);
  },
  changeChatNameGroup(nameGroup: string, groupId: string): Promise<any> {
    const url = `/chats/groups/${groupId}`;
    return axiosClient.patch(url, { nameGroup });
  },
  addChatMessage(params: AddChatMessage): Promise<any> {
    const url = `/chats/groups/messages/${params.groupId}`;
    return axiosClient.post(url, params);
  },
  getChatMessage(params: Filter): Promise<ListResponse<ChatMessage>> {
    const url = `/chats/groups/messages/${params._groupId}`;
    return axiosClient.get(url, { params });
  },
  removeChatMessage(messageId: string): Promise<any> {
    const url = `/chats/groups/messages/${messageId}`;
    return axiosClient.delete(url);
  },
  addChatMember(groupId: string, members: string[]): Promise<any> {
    const url = `/chats/groups/add-members/${groupId}`;
    return axiosClient.post(url, { members });
  },
};

export default chatApis;
