import { Owner } from './Motel';

export interface ChatGroup {
  _id: string;
  // lastMessage:
  members: Owner[];
  name: string;
  totalMembers: number;
  type: TypeGroup;
  unseen: number;
  createdAt: string;
  updatedAt: string;
}

// export interface ChatMessage {
//   content:
// }

export interface ChatMinimalGroup extends AddGroup {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddGroup {
  members: string[];
  name: string;
  type: TypeGroup;
}

type TypeGroup = 'private' | 'public';
