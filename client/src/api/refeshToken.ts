import { Response } from 'models';
import axiosClient from './axiosClient';

interface RefeshTokenReponse {
  accessToken: string;
  refeshToken: string;
}

export const refeshTokenApi = {
  refeshToken(refeshToken: string): Promise<Response<RefeshTokenReponse>> {
    const url = '/refesh-token';
    return axiosClient.post(url, { refeshToken });
  },
};
