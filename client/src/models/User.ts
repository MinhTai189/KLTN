import { School } from 'models';
import { ChatMinimalGroup } from './Chat';
import { Owner } from './Motel';

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
  groupPrivate?: ChatMinimalGroup[];
  rank?: string;
  favorite?: string[];
  likes?: Owner[];
  totalLikes?: number;
  posts?: number;
  notify?: Notify[];
  createdAt?: string;
  updatedAt?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ProfileUser {
  _id: string;
  name: string;
  avatarUrl: string;
  credit: number;
  isAdmin: boolean;
  school: School;
  rank: string;
  favorite: string[];
  likes: string[];
  posts: number;
  done: Activity[];
  createdAt?: string;
  updatedAt?: string;
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
  createdAt: string;
}

export type UserUpdate = Omit<UserDataTable, 'number' | 'username'>;

export interface Notify {
  _id: string;
  message: string;
  url: string;
  read: boolean;
  createdAt: string;
  imageUrl: string;
}

export interface UpdateData {
  avatarUrl: string | undefined;
  name: string;
  email: string;
  province: string;
  district: string;
  school: string;
}

export interface Activity {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  url: string;
}
