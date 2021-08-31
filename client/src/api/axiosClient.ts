import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Response } from '../models';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RefeshTokenReponse {
  accessToken: string;
  refeshToken: string;
}

// Add a request interceptor
axiosClient.interceptors.request.use(
  async function (config) {
    const accessToken =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken') ||
      '';
    const refeshToken =
      localStorage.getItem('refeshToken') ||
      sessionStorage.getItem('refeshToken') ||
      '';

    if (accessToken) {
      const jwt = jwt_decode<any>(accessToken);
      if (new Date(jwt.exp * 1000) < new Date()) {
        const response: Response<RefeshTokenReponse> = await axiosClient.post(
          '/refesh-token',
          {
            refeshToken,
          }
        );

        if (localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refeshToken', response.data.refeshToken);
        } else {
          sessionStorage.setItem('accessToken', response.data.accessToken);
          sessionStorage.setItem('refeshToken', response.data.refeshToken);
        }

        config.headers.token = response.data.accessToken;
      }
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosClient;
