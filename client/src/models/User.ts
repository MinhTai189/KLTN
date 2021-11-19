export interface User {
  _id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  credit: number;
  isAdmin: boolean;
  email: string;
  district: string;
  province: string;
  school: string;
  rank?: string;
  favorite?: string[];
  posts?: number;
  createdAt?: string;
  updatedAt?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface UserDataTable {
  key: string;
  number: number;
  username: string;
  email: string;
  isAdmin: string | boolean;
  name: string;
  credit: number;
  province: string;
  district: string;
  school: string;
}

export type UserUpdate = Omit<UserDataTable, 'number' | 'username'>;
