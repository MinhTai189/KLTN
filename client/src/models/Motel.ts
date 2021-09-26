import { UploadResponse } from 'models';

export interface Motel {
  _id?: string;
  name: string;
  images: UploadResponse[] | FormData | string;
  thumbnail: UploadResponse | FormData | string;
  room: Room[];
  desc: string;
  contact: Contact;
  status: boolean | string;
  available: number;
  school: string[];
  vote?: number;
  rate?: any[];
  mark?: number;
  editor?: Owner;
  owner?: Owner;
  address: string;
  createAt?: string;
  updateAt?: string;

  [key: string]: any;
}

export interface Room {
  _id?: string;
  idMotel?: string;
  area: Area;
  optional: string[];
  total: number;
  remain: number;
  price: number;
}

export interface MotelOnly {
  _id?: string;
  name: string;
  thumbnail: UploadResponse | FormData | string;
  images: any;
  desc: string;
  contact: Contact;
  status: boolean | string;
  available: number;
  school: string[];
  address: string;
}

export interface MotelDataTable {
  key: string;
  number: number;
  name: string;
  owner: string;
  status: boolean;
  vote: number;
  mark: number;
  available: number;
  amountRoom: number;
  address: string;
}

interface Contact {
  phone?: string;
  email?: string;
  facebook?: string;
  zalo?: string;
}

interface Area {
  length: number;
  width: number;
}

interface Owner {
  avatarUrl: string;
  name: string;
  _id: string;
}
