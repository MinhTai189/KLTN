import { call, debounce, put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { userApi } from 'api/user';
import { Filter, ListResponse, UserUpdate } from 'models';
import { toast } from 'react-toastify';
import { User } from '../../models';
import { userActions } from './usersSlice';

function* handleGetUser(action: PayloadAction<Filter>) {
  try {
    const reponse: ListResponse<User> = yield call(
      userApi.getUser,
      action.payload
    );

    yield put(userActions.getUserSuccess(reponse));
  } catch (err: any) {
    yield put(userActions.removeUserFailed(err.response.data.massage));
    yield call(toast.error, err.response.data.massage);
  }
}

function* handleRemoveUser(action: PayloadAction<string>) {
  try {
    yield userApi.removeUser(action.payload);

    yield put(userActions.removeUserSuccess(action.payload));
    yield call(toast.success, 'Xóa tài khoản thành công!');
  } catch (err: any) {
    yield put(userActions.removeUserFailed(err.response.data.massage));
    yield call(toast.error, err.response.data.massage);
  }
}

function* handleUpdateUser(action: PayloadAction<UserUpdate>) {
  try {
    const { key, ...data } = action.payload;

    yield userApi.updateUser(data, key);

    yield put(userActions.updateUserSuccess(action.payload));
    yield call(toast.success, 'Cập nhật tài khoản thành công!');
  } catch (err: any) {
    yield put(userActions.updateUserFailed(err.response.data.massage));
    yield call(toast.error, err.response.data.massage);
  }
}

function* handleSearchWithDebounce(action: PayloadAction<Filter>) {
  yield put(userActions.setFilter(action.payload));
}

export default function* userSaga() {
  yield takeLatest(userActions.getUser, handleGetUser);
  yield takeLatest(userActions.removeUser, handleRemoveUser);
  yield takeLatest(userActions.updateUser, handleUpdateUser);
  yield debounce(500, userActions.searchWithDebounce, handleSearchWithDebounce);
}
