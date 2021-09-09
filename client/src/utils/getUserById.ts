import { User } from 'models';

export const getUserById = (id: string, userData: User[]) => {
  return userData.find((user) => user._id === id) as User;
};
