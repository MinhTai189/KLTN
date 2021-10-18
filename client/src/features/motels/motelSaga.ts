import { call, debounce, put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { motelApi } from 'api/motel';
import { uploadApi } from 'api/upload';
import {
  Filter,
  ListResponse,
  Motel,
  MotelOnly,
  Response,
  Room,
  UploadResponse,
} from 'models';
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

function* handleGetMotelRandom(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<Motel> = yield call(
      motelApi.getMotelRandom,
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

function* handleUpdateMotel(action: PayloadAction<MotelOnly>) {
  try {
    const dataUpdate = action.payload;
    const successText = action.payload.invalid
      ? 'Thông tin của bạn đã được lưu. Hãy chờ Người quản trị web xác thực!'
      : 'Đã cập nhật dữ liệu thành công!';

    if (typeof action.payload.thumbnail !== 'string') {
      const response: Response<any> = yield call(
        uploadApi.byFormData,
        action.payload.thumbnail
      );
      dataUpdate.thumbnail = response.data;
    }

    if (action.payload.images.new) {
      const response: ListResponse<any> = yield call(
        uploadApi.byFormData,
        action.payload.images.new
      );
      dataUpdate.images = Array.isArray(response.data)
        ? [...dataUpdate.images.old, ...response.data]
        : [...dataUpdate.images.old, response.data];
    }

    yield call(motelApi.updateMotel, dataUpdate);
    yield put(motelActions.updateMotelSuccess());

    yield call(toast.success, successText);
  } catch (err: any) {
    yield call(toast.error, err.response.data.message);
    yield put(motelActions.updateMotelFailed(err.response.data.message));
  }
}

function* handleRemoveMotel(action: PayloadAction<string>) {
  try {
    yield call(motelApi.removeMotel, action.payload);

    yield put(motelActions.removeMotelSuccess());

    yield call(toast.success, 'Đã xóa dữ liệu thành công!');
  } catch (err: any) {
    yield call(toast.error, err.response.data.message);
    yield put(motelActions.removeMotelFailed(err.response.data.message));
  }
}

function* handleUpdateRoom(action: PayloadAction<Room>) {
  try {
    const successText = action.payload.invalid
      ? 'Thông tin của bạn đã được lưu! Hãy chờ Người quản trị web xác thưc!'
      : 'Đã cập nhật dữ liệu thành công!';

    yield call(motelApi.updateRoom, action.payload);
    yield put(motelActions.updateRoomSuccess())
    yield call(toast.success, successText);
  } catch (err: any) {
    yield call(toast.error, err.response.data.message);
    yield put(motelActions.updateRoomFailed(err.response.data.message));
  }
}

function* handleSearchWithDebounce(action: PayloadAction<Filter>) {
  yield put(motelActions.setFilter(action.payload));
}

export default function* motelSaga() {
  yield takeLatest(motelActions.getMotel, handleGetMotel);
  yield takeLatest(motelActions.getMotelRandom, handleGetMotelRandom);
  yield takeLatest(motelActions.addMotel, handleAddMotel);
  yield takeLatest(motelActions.updateMotel, handleUpdateMotel);
  yield takeLatest(motelActions.removeMotel, handleRemoveMotel);
  yield debounce(
    500,
    motelActions.searchWithDebounce,
    handleSearchWithDebounce
  );

  yield takeLatest(motelActions.updateRoom, handleUpdateRoom);
}
