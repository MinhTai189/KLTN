import { User } from './User';

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

export interface ReportRate {
  motelId: string;
  rateId: string;
  content: string;
}
