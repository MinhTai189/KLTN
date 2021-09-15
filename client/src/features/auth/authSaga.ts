import { PayloadAction } from '@reduxjs/toolkit';
import axiosClient from 'api/axiosClient';
import { push } from 'connected-react-router';
import { Response, User } from 'models';
import { put, takeLatest } from 'redux-saga/effects';
import { clearToken, getToken } from 'utils';
import { authActions } from './authSlice';
import { LoginData } from './models';

function* handleLogin(action: PayloadAction<LoginData>) {
  try {
    const data = {
      username: action.payload.username,
      password: action.payload.password,
    };

    const accessToken = action.payload.accessToken;

    const responseData: Response<User> = accessToken
      ? yield axiosClient.post('/login', data, {
          headers: {
            authorization: accessToken,
          },
        })
      : yield axiosClient.post('/login', data);

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
    yield put(push('/'));
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
    console.log('Xảy ra lỗi trong qua trình đăng xuất', err.message);
  }
}

export default function* authSaga() {
  yield takeLatest(authActions.login.type, handleLogin);
  yield takeLatest(authActions.logout.type, handleLogout);
}
