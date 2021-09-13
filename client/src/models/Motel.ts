import { District, Province } from 'models';

export interface Motel {
  _id: string;
  name: string;
  district: District;
  province: Province;
  images: string[];
  thumbnail: string;
  desc: string;
  room: number;
  contact: Contact;
  area: Area;
  status: boolean;
  vote?: number;
  rate?: any[];
  mark?: number;
  editor?: Owner;
  school: string[];
  owner: Owner;
  address: string;
  price: number;
  createAt?: string;
  updateAt?: string;

  [key: string]: any;
}

export interface MotelDataTable {
  key: string;
  number: number;
  address: string;
  name: string;
  status: boolean;
  room: number;
  area: string;
  vote: number;
  mark: number;
  price: string;
}

interface Contact {
  phone: string;
  email: string;
  facebook: string;
  zalo: string;
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
