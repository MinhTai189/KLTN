import { School, UploadResponse } from 'models';
import { Rate } from '.';

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
  rate?: Rate[];
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
  motelId?: string;
  area: Area;
  invalid?: boolean;
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
  school: School[];
  address: string;
  invalid?: boolean;
}

export interface MotelDetail extends MotelOnly {
  mark: number;
  optional: Optional;
  amountRate: number;
  vote: number;
  [key: string]: any;
}

export interface MotelDataTable {
  key: string;
  thumbnail: string;
  number: number;
  name: string;
  owner: Owner;
  status: boolean;
  vote: number;
  mark: number;
  available: number;
  amountRoom: number;
  address: string;
  room: any;
  createdAt: string;
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
  email: string;
  credit: number;
  posts: number;
  school: School;
  rank: string;
  motels: number;
  totalLikes: number;
}

export interface OwnerDetail extends Owner {
  createdAt: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  facebook?: string;
  zalo?: string;
}

export interface DropdownList extends School {
  motels: {
    _id: string;
    thumbnail: string;
  }[];
}

interface Area {
  length: number;
  width: number;
}

export interface Optional {
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
