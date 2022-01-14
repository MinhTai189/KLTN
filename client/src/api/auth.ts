import { ForgotPasswordData, RegisterData } from 'features/auth/models';
import axiosClient from './axiosClient';

const authApis = {
  ggLogin(tokenId: string): Promise<any> {
    const url = '/login-google';
    return axiosClient.post(url, { tokenId });
  },
  fbLogin(accessToken: string, userID: string): Promise<any> {
    const url = '/login-facebook';
    return axiosClient.post(url, { accessToken, userID });
  },
  register(params: any): Promise<any> {
    const url = '/register';
    return axiosClient.post(url, params);
  },
  registerGG(params: any): Promise<any> {
    const url = '/register-google';
    return axiosClient.post(url, params);
  },
  registerFB(params: any): Promise<any> {
    const url = '/register-facebook';
    return axiosClient.post(url, params);
  },
  forgotPassword(params: ForgotPasswordData): Promise<any> {
    const url = '/forgot-password';
    return axiosClient.post(url, params);
  },
  confirmEmail(params: string): Promise<any> {
    const url = '/confirm-email';
    return axiosClient.post(url, { params });
  },
  verificationEmail(params: string): Promise<any> {
    const url = '/confirm-sendmail';
    return axiosClient.post(url, { params });
  },
};

export default authApis;
