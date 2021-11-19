import { LikePost, Post, User } from 'models';

export interface Comment {
  _id: string;
  owner: User;
  post: Post;
  content: string;
  likes: LikePost[];
  createdAt: string;
  updatedAt: string;
  numLikes: number[];
  totalLikes: number;
  reply: ReplingComment;
}

export interface ReplingComment {
  _id: string;
  user: User;
  comment: string;
}

export interface AddedComment {}
