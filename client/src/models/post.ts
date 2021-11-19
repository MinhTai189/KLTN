import { Motel, School, User } from 'models';
import { Thread } from './Thread';

export interface Post {
  _id: string;
  owner: User;
  title: string;
  subject: Thread;
  content: string;
  tags: string[];
  status: boolean;
  block: boolean;
  type: number;
  motel: Motel;
  valid: boolean;
  require: Require;
  likes: LikePost[];
  numLikes: number[];
  totalLikes: number;
  numComments: number;
  createdAt: string;
  updatedAt: string;
}

export interface LikePost {
  type: number;
  owner: User;
  _id: string;
}

export interface Require {
  school: School[];
  price: number;
  additional: string;
}
