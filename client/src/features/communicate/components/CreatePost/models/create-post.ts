import { Motel, School } from 'models';

export interface DataPost {
  title: string;
  tags: TagsAddi;
  schools?: School[];
  price?: number;
  motels?: Motel[];
  additional: TagsAddi;
  content: string;
}

export interface TagsAddi {
  input: string;
  suggest: string[];
}
