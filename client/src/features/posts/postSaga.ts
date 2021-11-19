import { call, put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import postApi from 'api/post';
import { Response } from 'models';
import { Post } from 'models';
import { toast } from 'react-toastify';
import { DataPostFinal } from './components/CreatePost/models/create-post';
import { postAction } from './postSlice';

function* handleGetById(action: PayloadAction<string>) {
  try {
    const response: Response<Post> = yield postApi.getById(action.payload);

    yield put(postAction.getByIdSucceeded(response.data));
  } catch (error: any) {
    yield put(postAction.getByIdFailed(error.response?.data.message));
  }
}

function* handleAddPost(action: PayloadAction<DataPostFinal>) {
  try {
    yield postApi.add(action.payload);

    yield put(postAction.addPostSuccess());

    yield call(
      toast.success,
      'Đã đăng bài viết thành công. Hãy chờ "Quản trị web" duyệt!!!'
    );
  } catch (error: any) {
    yield call(toast.error, error.response?.data.message);

    yield put(postAction.addPostFailed(error.response?.data.message));
  }
}

export default function* postSaga() {
  yield takeLatest(postAction.getById, handleGetById);
  yield takeLatest(postAction.addPost, handleAddPost);
}
