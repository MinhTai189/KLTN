import { PayloadAction } from '@reduxjs/toolkit';
import chatApis from 'api/chat';
import {
  AddChatMessage,
  AddGroup,
  ChatGroup,
  ChatMessage,
  Filter,
  ListResponse,
} from 'models';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import { chatActions } from './chatSlice';

function* handleGetChatGroup() {
  try {
    const response: ListResponse<ChatGroup> = yield chatApis.getChatGroup();

    yield put(chatActions.getChatGroupSucceeded(response.data));
  } catch (error: any) {
    yield put(chatActions.getChatGroupFailed(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

function* handleAddChatGroup(action: PayloadAction<AddGroup>) {
  try {
    yield chatApis.addChatGroup(action.payload);

    yield put(chatActions.addChatGroupSucceeded(''));
  } catch (error: any) {
    yield put(chatActions.addChatGroupFailed(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

function* handleAddChatMessage(action: PayloadAction<AddChatMessage>) {
  try {
    yield chatApis.addChatMessage(action.payload);

    yield put(chatActions.addChatMessageSucceeded());
    yield put(chatActions.resetFilterMessage());
  } catch (error: any) {
    yield put(chatActions.addChatMessageFailed(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

function* handleGetChatMessage(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<ChatMessage> = yield chatApis.getChatMessage(
      action.payload
    );

    yield put(chatActions.getChatMessageSucceeded(response));
  } catch (error: any) {
    yield put(chatActions.getChatMessageFailed(error.response.data.message));
    yield call(toast.error, error.response.data.message);
  }
}

export default function* chatSaga() {
  yield takeLatest(chatActions.addChatGroup, handleAddChatGroup);
  yield takeLatest(chatActions.getChatGroup, handleGetChatGroup);
  yield takeLatest(chatActions.addChatMessage, handleAddChatMessage);
  yield takeLatest(chatActions.getChatMessage, handleGetChatMessage);
}
