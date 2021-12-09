import { put, takeLatest } from '@redux-saga/core/effects';
import provinceApi from 'api/province';
import { ListResponse, Province } from 'models';
import { provinceActions } from './provinceSlice';

function* handleGetAll() {
  try {
    const res: ListResponse<Province> = yield provinceApi.getAll();

    yield put(provinceActions.getAllSucceed(res.data));
  } catch (error: any) {
    yield put(provinceActions.getAllFailed(error.response.data.message));
  }
}

export default function* provinceSaga() {
  yield takeLatest(provinceActions.getAll, handleGetAll);
}
