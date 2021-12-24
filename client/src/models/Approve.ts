import { Contact, Editor, Optional, Owner, Room } from './Motel';
import { Rate } from './Rate';
import { School } from './School';

export interface MotelApprove {
  _id: string;
  name: string;
  images: string[];
  thumbnail: string;
  room: Room[];
  desc: string;
  contact: Contact;
  status: boolean;
  available: number;
  school: School[];
  vote: number;
  rate: Rate[];
  mark: number;
  editor: Editor[];
  owner: Owner;
  address: string;
  optional: Optional;
  createdAt: string;
  updatedAt: string;
  type: string;
}

export interface ComparisonMotel {
  old: MotelApprove;
  new: MotelApprove;
}

export interface RefuseMotel {
  type: string;
  motelId: string;
}

export interface RefuseRate {
  rateId: string;
  motelId: string;
}

export interface RateApprove extends Rate {
  owner: Owner;
  motel: {
    _id: string;
    name: string;
  };
}
