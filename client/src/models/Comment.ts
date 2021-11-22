import { LikePost, Post, User } from 'models';

interface CommentReply {
  _id: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
  numLikes: number[];
  totalLikes: number;
  content: string;
  likes: LikePost[];
}

export interface Comment extends CommentReply {
  post: Post;
  reply: ReplingComment[];
}

export interface ReplingComment extends CommentReply {
  user: User;
}

export interface AddComment {}
