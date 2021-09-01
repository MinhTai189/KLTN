import { PayloadAction } from '@reduxjs/toolkit';
import axiosClient from 'api/axiosClient';
import { push } from 'connected-react-router';
import { Response, User } from 'models';
import { put, takeLatest } from 'redux-saga/effects';
import { clearToken } from 'utils';
import { authActions } from './authSlice';
import { LoginData } from './models';

function* handleLogin(action: PayloadAction<LoginData>) {
  try {
    const data = {
      username: action.payload.username,
      password: action.payload.password,
    };
    const headers = {
      headers: {
        Authorization: action.payload.accessToken,
      },
    };

    const responseData: Response<User> = yield axiosClient.post(
      '/login',
      data,
      headers
    );

    clearToken();
    if (action.payload.rememberMe) {
      localStorage.setItem(
        'accessToken',
        JSON.stringify(responseData.data.accessToken)
      );
      localStorage.setItem(
        'refeshToken',
        JSON.stringify(responseData.data.refeshToken)
      );
    } else {
      sessionStorage.setItem(
        'accessToken',
        JSON.stringify(responseData.data.accessToken)
      );
      sessionStorage.setItem(
        'refeshToken',
        JSON.stringify(responseData.data.refeshToken)
      );
    }

    yield put(authActions.loginSuccess(responseData.data));

    //Redirect to Home page
    yield put(push('/'));
  } catch (err) {
    yield put(authActions.loginFailed(err.message));
  }
}

function* handleLogout() {
  clearToken();

  yield put(authActions.logout());
}

export default function* authSaga() {
  yield takeLatest(authActions.login.type, handleLogin);
  yield takeLatest(authActions.logout.type, handleLogout);
}
