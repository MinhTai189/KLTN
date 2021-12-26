import { Motel, Owner } from './Motel';

export interface Statistic {
  account: number;
  motel: number;
  approval: number;
  access: number;
  post: number;
}

export interface RecentData {
  activities: RecentActivity[];
  motels: Motel[];
}

export interface RecentActivity {
  title: string;
  content: string;
  createdAt: string;
  url: string;
  _id: string;
  owner: Owner;
}

export interface StatisticPost {
  _id: string;
  name: string;
  quantity: number;
}

export interface Chart {
  createdAt: {
    year: number;
    month: number;
  };
  quantity: number;
}

export interface Size {
  dataSize: number;
  totalSize: number;
  rate: number;
}

export interface RatioPost {
  _id: string;
  name: string;
  quantity: number;
}
