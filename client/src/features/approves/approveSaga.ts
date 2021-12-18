import { PayloadAction } from '@reduxjs/toolkit';
import approveApis from 'api/approve';
import {
  Filter,
  ListResponse,
  MotelApprove,
  Post,
  Rate,
  Report,
  Response,
} from 'models';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
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

function* handleApproveMotel(action: PayloadAction<string>) {
  try {
    yield approveApis.approveMotel(action.payload);

    yield put(motelApproveActions.approveSucceeded());
    yield put(motelApproveActions.setFilter({}));
    yield call(toast.success, 'Duyệt thành công!');
  } catch (error: any) {
    yield put(motelApproveActions.approveFailded(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

function* handleRefuseMotel(action: PayloadAction<string>) {
  try {
    yield approveApis.refuseMotel(action.payload);

    yield put(motelApproveActions.refuseSucceeded());
    yield put(motelApproveActions.setFilter({}));
    yield call(toast.success, 'Duyệt thành công!');
  } catch (error: any) {
    yield put(motelApproveActions.refuseFailded(error.response.data.message));
    yield call(toast.error, error.response.data.message);
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

function* handleApprovePost(action: PayloadAction<string>) {
  try {
    yield approveApis.approvePost(action.payload);

    yield put(postApproveActions.approveSucceeded());
    yield put(postApproveActions.setFilter({}));
    yield call(toast.success, 'Duyệt thành công!');
  } catch (error: any) {
    yield put(postApproveActions.approveFailded(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

function* handleRefusePost(action: PayloadAction<string>) {
  try {
    yield approveApis.refusePost(action.payload);

    yield put(postApproveActions.refuseSucceeded());
    yield put(postApproveActions.setFilter({}));
    yield call(toast.success, 'Duyệt thành công!');
  } catch (error: any) {
    yield put(postApproveActions.refuseFailded(error.response.data.message));
    yield call(toast.error, error.response.data.message);
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

function* handleApproveRate(action: PayloadAction<string>) {
  try {
    yield approveApis.approveRate(action.payload);

    yield put(rateApproveActions.approveSucceeded());
    yield put(rateApproveActions.setFilter({}));
    yield call(toast.success, 'Duyệt thành công!');
  } catch (error: any) {
    yield put(rateApproveActions.approveFailded(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

function* handleRefuseRate(action: PayloadAction<string>) {
  try {
    yield approveApis.refuseRate(action.payload);

    yield put(rateApproveActions.refuseSucceeded());
    yield put(rateApproveActions.setFilter({}));
    yield call(toast.success, 'Duyệt thành công!');
  } catch (error: any) {
    yield put(rateApproveActions.refuseFailded(error.response.data.message));
    yield call(toast.error, error.response.data.message);
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

function* handleApproveReport(action: PayloadAction<string>) {
  try {
    yield approveApis.approveReport(action.payload);

    yield put(reportApproveActions.approveSucceeded());
    yield put(reportApproveActions.setFilter({}));
    yield call(toast.success, 'Duyệt thành công!');
  } catch (error: any) {
    yield put(reportApproveActions.approveFailded(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

function* handleRefuseReport(action: PayloadAction<string>) {
  try {
    yield approveApis.refuseReport(action.payload);

    yield put(reportApproveActions.refuseSucceeded());
    yield put(reportApproveActions.setFilter({}));
    yield call(toast.success, 'Duyệt thành công!');
  } catch (error: any) {
    yield put(reportApproveActions.refuseFailded(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

export default function* approveSaga() {
  yield takeLatest(motelApproveActions.get, handleGetMotel);
  yield takeLatest(motelApproveActions.approve, handleApproveMotel);
  yield takeLatest(motelApproveActions.refuse, handleRefuseMotel);

  yield takeLatest(postApproveActions.get, handleGetPost);
  yield takeLatest(postApproveActions.approve, handleApprovePost);
  yield takeLatest(postApproveActions.refuse, handleRefusePost);

  yield takeLatest(rateApproveActions.get, handleGetRate);
  yield takeLatest(rateApproveActions.approve, handleApproveRate);
  yield takeLatest(rateApproveActions.refuse, handleRefuseRate);

  yield takeLatest(reportApproveActions.get, handleGetReport);
  yield takeLatest(reportApproveActions.approve, handleApproveReport);
  yield takeLatest(reportApproveActions.refuse, handleRefuseReport);
}
