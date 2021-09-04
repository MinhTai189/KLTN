import { Response } from 'models';
import { getToken } from 'utils';
import axiosClient from './axiosClient';

interface RefreshTokenReponse {
  accessToken: string;
  refeshToken: string;
}

export const refreshTokenApi = {
  refreshToken(): Promise<Response<RefreshTokenReponse>> {
    const { refreshToken } = getToken();
    const url = '/refresh-token';

    return axiosClient.post(url, { refreshToken });
  },
};
