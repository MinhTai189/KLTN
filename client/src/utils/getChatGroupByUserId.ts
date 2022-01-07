import { ChatGroup } from 'models';

export const getChatGroupByUserId = (groups: ChatGroup[], userId: string) => {
  return groups.find((group) => group.members.includes(userId));
};
