import { Owner } from './Motel';

export interface Report {
  _id: string;
  type: string;
  content: string;
  owner: Owner;
  createdAt: string;
  data: any;
}
