import { AddFeedback, ListResponse } from 'models';
import Feedback from 'models/Feedback';
import axiosClient from './axiosClient';

const feedbackApis = {
  getFeedback(): Promise<ListResponse<Feedback>> {
    const url = '/feedbacks';
    return axiosClient.get(url);
  },
  postFeedback(params: AddFeedback): Promise<any> {
    const url = '/feedbacks';
    return axiosClient.post(url, params);
  },
  removeFeedback(feedbackId: string): Promise<any> {
    const url = `/feedbacks/${feedbackId}`;
    return axiosClient.delete(url);
  },
};

export default feedbackApis;
