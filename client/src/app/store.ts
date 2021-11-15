import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import authReducer from 'features/auth/authSlice';
import postReducer from 'features/communicate/postSlice';
import showCreateModalReducer from 'features/communicate/showCreateModalSlice';
import motelReducer from 'features/motels/motelSlice';
import schoolReducer from 'features/school/schoolSlice';
import userReducer from 'features/users/usersSlice';
import createSagaMiddleware from 'redux-saga';
import { history } from 'utils';
import rootSaga from './rootSaga';

const reducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  motels: motelReducer,
  school: schoolReducer,
  post: postReducer,
  showCreateModal: showCreateModalReducer,
  router: connectRouter(history),
});
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware, routerMiddleware(history)),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
