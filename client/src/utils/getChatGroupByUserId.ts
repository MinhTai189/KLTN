import { ChatMinimalGroup } from 'models';

export const getChatGroupByUserId = (
  groups: ChatMinimalGroup[],
  userId: string
) => {
  return groups.find((group) => group.members.includes(userId));
};
