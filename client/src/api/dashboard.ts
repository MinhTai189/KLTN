import { Chart, Response, Statistic } from 'models';
import axiosClient from './axiosClient';

const dashboardApis = {
  getStatistic(): Promise<Response<Statistic>> {
    const url = '/dashboards/statisticals';
    return axiosClient.get(url);
  },
  getChart(): Promise<Response<any>> {
    const url = '/dashboards/charts';
    return axiosClient.get(url);
  },
};

export default dashboardApis;
