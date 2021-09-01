import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Response } from 'models';
import { refeshTokenApi } from './refeshToken';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  async function (config) {
    let accessToken =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');

    let refeshToken =
      localStorage.getItem('refeshToken') ||
      sessionStorage.getItem('refeshToken');
    const currentDate = new Date();

    if (Boolean(accessToken) && Boolean(refeshToken)) {
      accessToken = JSON.parse(accessToken as string);
      refeshToken = JSON.parse(refeshToken as string);
      const jwt: any = jwt_decode(accessToken as string);

      if (jwt.exp * 1000 < currentDate.getTime()) {
        try {
          const response: Response<any> = await refeshTokenApi.refeshToken(
            refeshToken as string
          );

          if (Boolean(localStorage.getItem('accessToken'))) {
            localStorage.setItem(
              'accessToken',
              JSON.stringify(response.data.accessToken)
            );
            localStorage.setItem(
              'refeshToken',
              JSON.stringify(response.data.refeshToken)
            );
          } else {
            sessionStorage.setItem(
              'accessToken',
              JSON.stringify(response.data.accessToken)
            );
            sessionStorage.setItem(
              'refeshToken',
              JSON.stringify(response.data.refeshToken)
            );
          }

          config.headers['authorization'] = response.data.accessToken;
        } catch (err) {
          console.log('Loi xay ra trong qua trinh refesh token', err.message);
        }
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
