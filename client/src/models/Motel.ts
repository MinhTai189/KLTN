import { School, UploadResponse } from 'models';

export interface Motel {
  _id?: string;
  name: string;
  images: UploadResponse[] | FormData | string[];
  thumbnail: UploadResponse | FormData | string;
  room: Room[];
  desc: string;
  contact: Contact;
  status: boolean | string;
  available: number;
  school: any;
  vote?: number;
  rate?: any[];
  mark?: number;
  editor?: Editor[];
  owner?: Owner;
  address: string;
  optional?: Optional;
  createdAt?: string;
  updatedAt?: string;

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

export interface Editor {
  user: Owner;
  edited: string;
  createdAt: string;
}

export interface Owner {
  avatarUrl: string;
  name: string;
  _id: string;
  isAdmin: boolean;
  school: School;
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

interface Optional {
  wifi: boolean;
  ml: boolean;
  gac: boolean;
  nx: boolean;
  camera: boolean;
  quat: boolean;
  tl: boolean;
  giuong: boolean;
  gt: boolean;
  cc: boolean;
  dcvs: boolean;
}
