export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
  province: string;
  district: string;
  school: string;
  avatarUrl: string;
}

export interface AddiRegisterData {
  email?: string;
  province: string;
  district: string;
  school: string;
}
