import { call, put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import postApi from 'api/post';
import { Filter, ListResponse, Response } from 'models';
import { Post } from 'models';
import { toast } from 'react-toastify';
import { DataPostFinal } from './components/CreatePost/models/create-post';
import { createPostModalActions } from './openCreatePostModalSlice';
import { postAction } from './postSlice';

function* handleGetPost(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<Post> = yield postApi.get(action.payload);

    yield put(postAction.getSucceeded(response));
  } catch (error: any) {
    yield put(postAction.getFailed(error.response?.data.message));
  }
}

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

    yield put(createPostModalActions.setShowModal(0));
  } catch (error: any) {
    yield call(toast.error, error.response?.data.message);

    yield put(postAction.addPostFailed(error.response?.data.message));
    yield put(createPostModalActions.setShowModal(0));
  }
}

export default function* postSaga() {
  yield takeLatest(postAction.get, handleGetPost);
  yield takeLatest(postAction.getById, handleGetById);
  yield takeLatest(postAction.addPost, handleAddPost);
}
