import { Owner } from './Motel';

export default interface Feedback {
  _id: string;
  content: string;
  title: string;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
}

export interface AddFeedback {
  content: string;
  title: string;
}
