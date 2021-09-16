import { call, put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import axiosClient from 'api/axiosClient';
import { motelApi } from 'api/motel';
import { uploadApi } from 'api/upload';
import { Filter, ListResponse, Motel, Response, UploadResponse } from 'models';
import { toast } from 'react-toastify';
import { motelActions } from './motelSlice';

function* handleGetMotel(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<Motel> = yield call(
      motelApi.getMotel,
      action.payload
    );

    yield put(motelActions.getMotelSuccess(response));
  } catch (err: any) {
    yield call(toast.error, err.response.data.message);
    yield put(motelActions.getMotelFailed(err.response.data.message));
  }
}

function* handleAddMotel(action: PayloadAction<Motel>) {
  try {
    const responseThumbnail: Response<UploadResponse> = yield call(
      uploadApi.byFormData,
      action.payload.thumbnail
    );
    const responseImages: ListResponse<UploadResponse> = yield call(
      uploadApi.byFormData,
      action.payload.images
    );

    const addData: Motel = {
      ...action.payload,
      thumbnail: responseThumbnail.data,
      images: responseImages.data,
    };

    yield motelApi.addMotel(addData);

    yield put(motelActions.addMotelSuccess());
    yield call(toast.success, 'Nhà trọ đã được thêm thành công!');
  } catch (err: any) {
    yield call(toast.error, err.response.data.message);
    yield put(motelActions.addMotelFailed(err.response.data.message));
  }
}

export default function* motelSaga() {
  yield takeLatest(motelActions.getMotel, handleGetMotel);
  yield takeLatest(motelActions.addMotel, handleAddMotel);
}
