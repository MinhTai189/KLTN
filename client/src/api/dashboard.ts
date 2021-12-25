import axiosClient from './axiosClient';

const dashboardApis = {
  get(): Promise<any> {
    const url = '/dashboards/statisticals';
    return axiosClient.get(url);
  },
};

export default dashboardApis;
