import { ListResponse, Response, UploadResponse } from 'models';
import axiosClient from 'api/axiosClient';

export const uploadApi = {
  byFormData: (
    form: any
  ): Promise<Response<UploadResponse> | ListResponse<UploadResponse>> => {
    const url = '/uploads';
    return axiosClient.post(url, form, {
      headers: { 'Content-type': 'multipart/form-data' },
    });
  },
};
