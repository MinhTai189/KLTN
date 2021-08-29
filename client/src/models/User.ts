export interface User {
  _id: string;
  username: string;
  name: string;
  avatarUrl: string;
  credit: number;
  isAdmin: boolean;
  email: string;
  district: string;
  province: string;
  school: string;
  createdAt: string;
  updatedAt: string;
  accessToken: string;

  [key: string]: any;
}
