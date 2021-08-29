import { User } from 'models';

export interface LoginData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: string;
  message: string;
  accessToken: string;
  data: User;
}
