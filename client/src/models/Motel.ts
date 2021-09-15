export interface Motel {
  _id?: string;
  name: string;
  images: string[];
  thumbnail: string;
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
  area: Area;
  optional: string[];
  total: number;
  remain: number;
  price: number;
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
