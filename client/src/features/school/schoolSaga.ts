import { call, put, takeLatest } from '@redux-saga/core/effects';
import schoolApi from 'api/school';
import { ListResponse, School } from 'models';
import { schoolActions } from './schoolSlice';

function* handleGetAllSchool() {
  try {
    const response: ListResponse<School> = yield call(schoolApi.getAll);

    yield put(schoolActions.getSchoolSuccess(response.data));
  } catch (err: any) {
    yield put(schoolActions.getSchoolFailed());
    yield call(console.log, err.response.data.massage);
  }
}

export default function* schoolSaga() {
  yield takeLatest(schoolActions.getSchool, handleGetAllSchool);
}
