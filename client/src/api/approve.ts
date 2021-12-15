import { Filter, ListResponse, MotelApprove, Post, Rate, Report } from 'models';
import axiosClient from './axiosClient';

const approveApis = {
  getMotel(params: Filter): Promise<ListResponse<MotelApprove>> {
    const url = '/approves/motels';
    return axiosClient.get(url, { params });
  },
  getPost(params: Filter): Promise<ListResponse<Post>> {
    const url = '/approves/posts';
    return axiosClient.get(url, { params });
  },
  getRate(params: Filter): Promise<ListResponse<Rate>> {
    const url = '/approves/rates';
    return axiosClient.get(url, { params });
  },
  getReport(params: Filter): Promise<ListResponse<Report>> {
    const url = '/approves/reports';
    return axiosClient.get(url, { params });
  },
};

export default approveApis;
