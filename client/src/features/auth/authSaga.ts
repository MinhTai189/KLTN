import { PayloadAction } from '@reduxjs/toolkit';
import axiosClient from 'api/axiosClent';
import { User } from 'models';
import { call, fork, put, take } from 'redux-saga/effects';
import { authActions } from './authSlice';
import { LoginData, LoginResponse } from './models';
import { push } from 'connected-react-router';

function* handleLogin(payload: LoginData) {
  try {
    const responseData: LoginResponse = yield axiosClient.post('/login', {
      username: payload.username,
      password: payload.password,
    });

    const userData: User = {
      ...responseData.data,
      accessToken: responseData.accessToken,
    };

    payload.rememberMe && localStorage.setItem('user', JSON.stringify(userData));

    yield put(authActions.loginSuccess(userData));

    //Redirect to Home page
    yield put(push('/'));
  } catch (err) {
    yield put(authActions.loginFailed(err.message));
  }
}

function* handleLogout() {
  localStorage.removeItem('user');

  yield put(authActions.logout());
}

function* workFlowLogin() {
  while (1) {
    let userData = true;

    while (userData) {
      const action: PayloadAction<LoginData> = yield take(authActions.login.type);
      yield fork(handleLogin, action.payload);
      userData = !Boolean(localStorage.getItem('user'));
    }

    yield take(authActions.logout.type);
    yield call(handleLogout);
  }
}

export default function* authSaga() {
  yield fork(workFlowLogin);
}
