export interface Statistic {
  account: number;
  motel: number;
  approval: number;
  access: number;
  post: number;
}

export interface RecentActivities {
  title: string;
  content: string;
  createdAt: string;
  url: string;
  _id: string;
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
