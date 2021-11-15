import { Motel, School } from 'models';

export interface DataPost {
  title: string;
  tags: TagsAddi;
  schools?: School[];
  price?: number;
  motel?: Motel;
  additional: TagsAddi;
  content: string;
}

export interface TagsAddi {
  input: string;
  suggest: string[];
}

export interface DataPostFinal
  extends Omit<DataPost, 'tags' | 'additional' | 'motel'> {
  subjectId: string;
  tags: string;
  additional: string;
  motel: string | undefined;
}
