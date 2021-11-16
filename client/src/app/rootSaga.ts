import authSaga from 'features/auth/authSaga';
import postSaga from 'features/posts/postSaga';
import motelSaga from 'features/motels/motelSaga';
import schoolSaga from 'features/school/schoolSaga';
import userSaga from 'features/users/usersSaga';
import { all, call } from 'redux-saga/effects';
import threadSaga from 'features/communicate/threadSaga';

export default function* rootSaga() {
  yield all([
    call(authSaga),
    call(userSaga),
    call(motelSaga),
    call(postSaga),
    call(schoolSaga),
    call(threadSaga),
  ]);
}
