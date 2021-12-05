import { takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { notifyApi } from 'api/notify';
import { notifyActions } from './notifySlice';

function* handleReadNotify(action: PayloadAction<string>) {
  try {
    yield notifyApi.read(action.payload);

    yield notifyActions.readSucceeded();
  } catch (error: any) {
    yield notifyActions.readFailed(error.response.data.message);
  }
}

function* handleReadAllNotify() {
  try {
    yield notifyApi.readAll();

    yield notifyActions.readAllSucceeded();
  } catch (error: any) {
    yield notifyActions.readAllFailed(error.response.data.message);
  }
}

export default function* notifySaga() {
  yield takeLatest(notifyActions.read, handleReadNotify);
  yield takeLatest(notifyActions.readAll, handleReadAllNotify);
}
