import { PayloadAction } from '@reduxjs/toolkit';
import axiosClient from 'api/axiosClient';
import { push } from 'connected-react-router';
import { Response, User } from 'models';
import * as Eff from 'redux-saga/effects';
import { put } from 'redux-saga/effects';
import { authActions } from './authSlice';
import { LoginData } from './models';

function* handleLogin(action: PayloadAction<LoginData>) {
  try {
    const responseData: Response<User> = yield axiosClient.post('/login', {
      username: action.payload.username,
      password: action.payload.password,
    });

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
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refeshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refeshToken');

  yield put(authActions.logout());
}

export default function* authSaga() {
  yield takeLeading(authActions.login, handleLogin);
  yield takeLeading(authActions.logout, handleLogout);
}

const takeLeading: any = Eff.takeLeading;
