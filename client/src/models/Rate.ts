import { User } from 'models';

export interface Rate {
  user: User;
  star: number;
  content: string;
  createAt: string;
  _id: string;
}

export interface AddaRate {
  motelId: string;
  star: number;
  content: string;
}
