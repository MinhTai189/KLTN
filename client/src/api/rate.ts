import { AddaRate, ReportRate, Response } from 'models';
import axiosClient from './axiosClient';

const rateApi = {
  addRate: (params: AddaRate): Promise<Response<any>> => {
    const url = `/motels/rates/${params.motelId}`;
    return axiosClient.post(url, { params });
  },
  reportRate: (params: ReportRate): Promise<Response<any>> => {
    const url = `/motels/rates/reports`;
    return axiosClient.post(url, { params });
  },
};

export default rateApi;
