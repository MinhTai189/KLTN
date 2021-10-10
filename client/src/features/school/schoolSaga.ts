import { call, debounce, put, takeLatest } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { motelApi } from 'api/motel';
import { Filter, ListResponse, SchoolDropdown } from 'models';
import { toast } from 'react-toastify';
import { schoolActions } from './schoolSlice';

function* handleGetAllSchool(action: PayloadAction<Filter>) {
  try {
    const response: ListResponse<SchoolDropdown> = yield call(
      motelApi.getDropdownList,
      action.payload
    );

    yield put(schoolActions.getSchoolSuccess(response.data));
  } catch (err: any) {
    yield put(schoolActions.getSchoolFailed());
    yield call(toast.error, err.response.data.massage);
  }
}

function* handleSearchWithDebounce(action: PayloadAction<Filter>) {
  yield put(schoolActions.setFilter(action.payload));
}

export default function* schoolSaga() {
  yield takeLatest(schoolActions.getSchool, handleGetAllSchool);
  yield debounce(
    500,
    schoolActions.searchWithDebounce,
    handleSearchWithDebounce
  );
}
