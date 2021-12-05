import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import authReducer from 'features/auth/authSlice';
import postReducer from 'features/posts/postSlice';
import showCreateModalReducer from 'features/posts/showCreateModalSlice';
import motelReducer from 'features/motels/motelSlice';
import schoolReducer from 'features/school/schoolSlice';
import userReducer from 'features/users/usersSlice';
import createSagaMiddleware from 'redux-saga';
import { history } from 'utils';
import rootSaga from './rootSaga';
import threadReducer from 'features/communicate/threadSlice';
import commentReducer from 'features/comment/commentSlice';
import createdPostReducer from 'features/posts/openCreatePostModalSlice';
import notifyReducer from 'features/notification/notifySlice';

const reducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  motels: motelReducer,
  school: schoolReducer,
  post: postReducer,
  thread: threadReducer,
  comment: commentReducer,
  showCreateModal: showCreateModalReducer,
  createdPostModal: createdPostReducer,
  notify: notifyReducer,
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
