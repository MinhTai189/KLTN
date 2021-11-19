import { takeLatest, put } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import commentApi from 'api/comment';
import { Comment, Filter, ListResponse } from 'models';
import { commentAction } from './commentSlice';

function* hanldeGetComment(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<Comment> = yield commentApi.get(
      action.payload
    );

    yield put(commentAction.getSucceeded(response));
  } catch (error: any) {
    yield put(commentAction.getFailed(error.response.data.message));
  }
}

export default function* commentSaga() {
  yield takeLatest(commentAction.get, hanldeGetComment);
}
