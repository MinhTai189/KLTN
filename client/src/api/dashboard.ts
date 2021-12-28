import { Chart, RecentData, Response, Statistic } from 'models';
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
  getDataDoughnut(): Promise<Response<any>> {
    const url = '/dashboards/stats';
    return axiosClient.get(url);
  },
  getRecentData(): Promise<Response<RecentData>> {
    const url = '/dashboards/recents';
    return axiosClient.get(url);
  },
  getListOnlinePermission(): Promise<Response<any>> {
    const url = '/dashboards/lists';
    return axiosClient.get(url);
  },
};

export default dashboardApis;
