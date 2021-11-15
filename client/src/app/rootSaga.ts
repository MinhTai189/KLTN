import authSaga from 'features/auth/authSaga';
import postSaga from 'features/communicate/postSaga';
import motelSaga from 'features/motels/motelSaga';
import schoolSaga from 'features/school/schoolSaga';
import userSaga from 'features/users/usersSaga';
import { all, call } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    call(authSaga),
    call(userSaga),
    call(motelSaga),
    call(postSaga),
    call(schoolSaga),
  ]);
}
