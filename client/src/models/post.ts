import { Motel, School, User } from 'models';
import { Owner } from './Motel';
import { Thread } from './Thread';

export interface Post {
  _id: string;
  owner: Owner;
  title: string;
  subject: Thread;
  content: string;
  tags: string[];
  status: boolean;
  block: boolean;
  type: number;
  motel: Motel;
  posts: PostMinimal[];
  motels: Motel[];
  valid: boolean;
  require: Require;
  likes: LikePost[];
  numLikes: number[];
  totalLikes: number;
  numComments: number;
  createdAt: string;
  updatedAt: string;
}

interface PostMinimal {
  _id: string;
  title: string;
}

export interface LikePost {
  type: number;
  owner: User;
  _id: string;
}

export interface Require {
  schools: School[];
  price: number;
  additional: string;
}
