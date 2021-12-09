export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export interface ChangePassword {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}
