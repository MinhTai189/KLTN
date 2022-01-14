import {
  ComparisonMotel,
  Filter,
  ListResponse,
  MotelApprove,
  RateApprove,
  RefuseMotel,
  RefuseRate,
  Report,
  Response,
} from 'models';
import { Post } from 'models/Post';
import axiosClient from './axiosClient';

const approveApis = {
  getMotel(params: Filter): Promise<ListResponse<MotelApprove>> {
    const url = '/approves/motels';
    return axiosClient.get(url, { params });
  },
  approveMotel(motelId: string): Promise<any> {
    const url = `/approves/motels/${motelId}`;
    return axiosClient.post(url);
  },
  refuseMotel(query: RefuseMotel): Promise<any> {
    const url = `/approves/motels/${query.type}/${query.motelId}`;
    return axiosClient.delete(url);
  },
  getComparisonMotel(motelId: string): Promise<Response<ComparisonMotel>> {
    const url = `/approves/motels/comparisons/${motelId}`;
    return axiosClient.get(url);
  },
  getPost(params: Filter): Promise<ListResponse<Post>> {
    const url = '/approves/posts';
    return axiosClient.get(url, { params });
  },
  approvePost(postId: string): Promise<any> {
    const url = `/approves/posts/${postId}`;
    return axiosClient.post(url);
  },
  refusePost(postId: string): Promise<any> {
    const url = `/approves/posts/${postId}`;
    return axiosClient.delete(url);
  },
  getRate(params: Filter): Promise<ListResponse<RateApprove>> {
    const url = '/approves/rates';
    return axiosClient.get(url, { params });
  },
  approveRate(rateId: string): Promise<any> {
    const url = `/approves/rates/${rateId}`;
    return axiosClient.post(url);
  },
  refuseRate(query: RefuseRate): Promise<any> {
    const url = `/approves/rates/${query.motelId}/${query.rateId}`;
    return axiosClient.delete(url);
  },
  getReport(params: Filter): Promise<ListResponse<Report>> {
    const url = '/approves/reports';
    return axiosClient.get(url, { params });
  },
  approveReport(reportId: string): Promise<any> {
    const url = `/approves/reports/${reportId}`;
    return axiosClient.post(url);
  },
  refuseReport(reportId: string): Promise<any> {
    const url = `/approves/reports/${reportId}`;
    return axiosClient.delete(url);
  },
};

export default approveApis;
