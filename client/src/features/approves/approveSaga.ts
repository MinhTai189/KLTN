import { PayloadAction } from '@reduxjs/toolkit';
import approveApis from 'api/approve';
import { Filter, ListResponse, MotelApprove, Post, Rate, Report } from 'models';
import { put, takeLatest } from 'redux-saga/effects';
import { motelApproveActions } from './motelApprove';
import { postApproveActions } from './postApprove';
import { rateApproveActions } from './rateApprove';
import { reportApproveActions } from './reportApprove';

function* handleGetMotel(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<MotelApprove> = yield approveApis.getMotel(
      action.payload
    );

    yield put(motelApproveActions.getSucceeded(response));
  } catch (error: any) {
    yield put(motelApproveActions.getFailded(error.response.data.message));
  }
}

function* handleGetPost(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<Post> = yield approveApis.getPost(
      action.payload
    );

    yield put(postApproveActions.getSucceeded(response));
  } catch (error: any) {
    yield put(postApproveActions.getFailded(error.response.data.message));
  }
}

function* handleGetRate(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<Rate> = yield approveApis.getRate(
      action.payload
    );

    yield put(rateApproveActions.getSucceeded(response));
  } catch (error: any) {
    yield put(rateApproveActions.getFailded(error.response.data.message));
  }
}

function* handleGetReport(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<Report> = yield approveApis.getReport(
      action.payload
    );

    yield put(reportApproveActions.getSucceeded(response));
  } catch (error: any) {
    yield put(reportApproveActions.getFailded(error.response.data.message));
  }
}

export default function* approveSaga() {
  yield takeLatest(motelApproveActions.get, handleGetMotel);
  yield takeLatest(postApproveActions.get, handleGetPost);
  yield takeLatest(rateApproveActions.get, handleGetRate);
  yield takeLatest(reportApproveActions.get, handleGetReport);
}
