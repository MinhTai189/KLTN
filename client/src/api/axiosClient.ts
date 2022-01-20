import axios from 'axios';
import { getToken, setToken } from 'utils';
import { refreshTokenApi } from './refreshToken';

let url = '';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  url = 'http://localhost:5000/api';
} else {
  url = 'https://kltnapi.herokuapp.com/api';
}

const axiosClient = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const { accessToken } = getToken();

    if (Boolean(accessToken)) {
      config.headers['authorization'] = accessToken;
    }
    return config;
  },
  (error) => {
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
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs: any = await refreshTokenApi.refreshToken();
          const { accessToken, refreshToken } = rs.data;
          setToken(accessToken, refreshToken);
          axiosClient.defaults.headers.common['authorization'] = accessToken;

          return axiosClient(originalConfig);
        } catch (_error: any) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
