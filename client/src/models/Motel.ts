import { District, Province, School, User } from 'models';

export interface Motel {
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
  editor?: User;
  school: School;
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
