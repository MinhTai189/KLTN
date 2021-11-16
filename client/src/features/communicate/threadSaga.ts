import { call, put, takeLatest } from '@redux-saga/core/effects';
import threadApi from 'api/thread';
import { ListResponse } from 'models';
import { Thread } from 'models/Thread';
import { threadActions } from './threadSlice';

function* handleGetData() {
  try {
    const response: ListResponse<Thread> = yield threadApi.get();

    yield put(threadActions.getSucceeded(response.data));
  } catch (error) {
    yield put(threadActions.getFailded());

    yield call(console.log, 'Tải danh sách chủ đề thất bại!');
  }
}

export default function* threadSaga() {
  yield takeLatest(threadActions.get, handleGetData);
}
