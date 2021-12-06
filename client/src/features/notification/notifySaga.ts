import { put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { notifyApi } from 'api/notify';
import { authActions } from 'features/auth/authSlice';
import { Filter, ListResponseNotif } from 'models';
import { notifyActions } from './notifySlice';

function* handleGetNotify(action: PayloadAction<Filter>) {
  try {
    const response: ListResponseNotif = yield notifyApi.get(action.payload);

    yield put(notifyActions.getSucceeded(response));
  } catch (error: any) {
    yield put(notifyActions.getFailed(error.response.data.message));
  }
}

function* handleReadNotify(action: PayloadAction<string>) {
  try {
    yield notifyApi.read(action.payload);

    yield put(notifyActions.readSucceeded());

    yield put(authActions.setReadOneNotify(action.payload));
  } catch (error: any) {
    yield put(notifyActions.readFailed(error.response.data.message));
  }
}

function* handleReadAllNotify() {
  try {
    yield notifyApi.readAll();

    yield put(notifyActions.readAllSucceeded());

    yield put(authActions.setReadAllNotify());
  } catch (error: any) {
    yield put(notifyActions.readAllFailed(error.response.data.message));
  }
}

export default function* notifySaga() {
  yield takeLatest(notifyActions.get, handleGetNotify);
  yield takeLatest(notifyActions.read, handleReadNotify);
  yield takeLatest(notifyActions.readAll, handleReadAllNotify);
}
