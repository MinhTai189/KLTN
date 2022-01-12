import { Owner } from './Motel';

export interface ChatGroup {
  _id: string;
  lastMessage: ChatMessage;
  members: Owner[];
  name: string;
  totalMembers: number;
  type: TypeGroup;
  unseen: number;
  ononlines: Owner[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  content: string;
  owner: Owner;
  seen: string[];
  type: TypeMessage;
  urlImages: string[];
  urlGif: string;
  dataLink: PreviewLink;
  removed?: boolean;
  createdAt: string;
}

export interface AddChatMessage {
  groupId: string;
  content?: string;
  type: TypeMessage;
  urlImages?: string[];
  urlGif?: string;
}

export interface AddLastMessage {
  groupId: string;
  message: ChatMessage;
}

export interface AddListOnline {
  groupId: string;
  list: Owner[];
}

export interface NotifyNewMessage {
  group: ChatGroup;
  message: ChatMessage;
  numMessages: number;
}

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

export interface PreviewLink {
  url: string;
  domain: string;
  title: string;
  img: string;
  description: string;
}

type TypeGroup = 'private' | 'public';
export type TypeMessage = 'text' | 'gif' | 'image' | 'link';
