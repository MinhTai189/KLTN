import { School, User } from 'models';
import { Thread } from './Thread';

export interface Post {
  _id: string;
  owner: User;
  title: string;
  subject: Thread;
  content: string;
  hashTag: string[];
  status: boolean;
  block: boolean;
  type: number;
  school: School[];
  valid: boolean;
  require: string[];
  likes: LikePost[];
  createdAt: string;
  updatedAt: string;
}

interface LikePost {
  type: number;
  owner: User;
  _id: string;
}
