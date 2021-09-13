import { call, put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { motelApi } from 'api/motel';
import { Filter, ListResponse, Motel } from 'models';
import { toast } from 'react-toastify';
import { motelActions } from './motelSlice';

function* handleGetMotel(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<Motel> = yield call(
      motelApi.getMotel,
      action.payload
    );

    yield put(motelActions.getMotelSuccess(response));
  } catch (err: any) {
    yield call(toast.error, err.response.data.message);
  }
}

export default function* motelSaga() {
  yield takeLatest(motelActions.getMotel, handleGetMotel);
}
