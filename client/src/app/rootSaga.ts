import authSaga from 'features/auth/authSaga';
import motelSaga from 'features/motels/motelSaga';
import userSaga from 'features/users/usersSaga';
import { all, call } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([call(authSaga), call(userSaga), call(motelSaga)]);
}
