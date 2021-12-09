import { PayloadAction } from '@reduxjs/toolkit';
import axiosClient from 'api/axiosClient';
import { userApi } from 'api/user';
import { push } from 'connected-react-router';
import { Response, User } from 'models';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import { clearToken } from 'utils';
import { authActions } from './authSlice';
import { LoginData } from './models';

function* handleLogin(action: PayloadAction<LoginData>) {
  try {
    const data = {
      username: action.payload.username,
      password: action.payload.password,
    };

    const responseData: Response<User> = yield axiosClient.post('/login', data);

    clearToken();
    if (action.payload.rememberMe) {
      localStorage.setItem(
        'accessToken',
        JSON.stringify(responseData.data.accessToken)
      );
      localStorage.setItem(
        'refreshToken',
        JSON.stringify(responseData.data.refreshToken)
      );
    } else {
      sessionStorage.setItem(
        'accessToken',
        JSON.stringify(responseData.data.accessToken)
      );
      sessionStorage.setItem(
        'refreshToken',
        JSON.stringify(responseData.data.refreshToken)
      );
    }

    yield put(authActions.loginSuccess(responseData.data));

    //Redirect to Home page
    if (!action.payload.isAutoLogin) yield put(push('/'));
  } catch (err: any) {
    if (err.response.data.message)
      yield put(authActions.loginFailed(err.response.data.message));
  }
}

function* handleLogout() {
  try {
    yield axiosClient.post('/logout');

    clearToken();
    yield put(authActions.logoutSuccess());
  } catch (err: any) {
    yield call(toast.error, err.reponse.data.message);
  }
}

function* handleLikeMotel(action: PayloadAction<string>) {
  try {
    yield call(userApi.likeMotel, action.payload);

    yield put(authActions.likeMotelSuccess(action.payload));
  } catch (err: any) {
    yield put(authActions.likeMotelFailed(err.response.data.massage));
    yield call(toast.error, err.response.data.massage);
  }
}

function* handleUnlikeMotel(action: PayloadAction<string>) {
  try {
    yield call(userApi.unlikeMotel, action.payload);

    yield put(authActions.unlikeMotelSuccess(action.payload));
  } catch (err: any) {
    yield put(authActions.unlikeMotelFailed(err.response.data.massage));
    yield call(toast.error, err.response.data.massage);
  }
}

export default function* authSaga() {
  yield takeLatest(authActions.login, handleLogin);
  yield takeLatest(authActions.logout, handleLogout);
  yield takeLatest(authActions.likeMotel, handleLikeMotel);
  yield takeLatest(authActions.unlikeMotel, handleUnlikeMotel);
}
