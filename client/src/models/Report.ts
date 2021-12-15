import { User } from './User';

export interface Report {
  _id: string;
  type: string;
  content: string;
  owner: User;
  createdAt: string;
  data: any;
}
