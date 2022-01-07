import authSaga from 'features/auth/authSaga';
import postSaga from 'features/posts/postSaga';
import motelSaga from 'features/motels/motelSaga';
import schoolSaga from 'features/school/schoolSaga';
import userSaga from 'features/users/usersSaga';
import { all, call } from 'redux-saga/effects';
import threadSaga from 'features/communicate/threadSaga';
import commentSaga from 'features/comment/commentSaga';
import notifySaga from 'features/notification/notifySaga';
import provinceSaga from 'features/province/provinceSaga';
import approveSaga from 'features/approves/approveSaga';
import dashboardSaga from 'features/dashboard/dashboardSaga';
import chatSaga from 'features/chats/chatSaga';

export default function* rootSaga() {
  yield all([
    call(authSaga),
    call(userSaga),
    call(motelSaga),
    call(postSaga),
    call(threadSaga),
    call(commentSaga),
    call(notifySaga),
    call(provinceSaga),
    call(schoolSaga),
    call(approveSaga),
    call(dashboardSaga),
    call(chatSaga),
  ]);
}
