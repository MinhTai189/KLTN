import { AddaRate, Response } from 'models';
import axiosClient from './axiosClient';

const rateApi = {
  addRate: (params: AddaRate): Promise<Response<any>> => {
    const url = `/motels/rates/${params.motelId}`;
    return axiosClient.post(url, { params });
  },
  reportRate: (idRate: string, idMotel: string): Promise<Response<any>> => {
    const url = `/motels/rates/reports/${idMotel}/${idRate}`;
    return axiosClient.post(url);
  },
};

export default rateApi;
