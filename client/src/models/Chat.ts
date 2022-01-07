export interface ChatGroup extends AddGroup {
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
