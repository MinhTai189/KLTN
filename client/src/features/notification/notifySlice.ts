import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import {
  Filter,
  ListResponseNotif,
  Notify,
  NotifyResponse,
  Pagination,
} from 'models';

interface NofifyState {
  data: NotifyResponse | undefined;
  loading: boolean;
  error: string;
  filter: Filter;
  pagination: Pagination;
}

const initialState: NofifyState = {
  data: undefined,
  loading: false,
  error: '',
  filter: {
    _page: 1,
    _limit: 10,
  },
  pagination: {
    _page: 1,
    _limit: 10,
    _totalRows: 10,
  },
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    get: (state, action: PayloadAction<Filter>) => {
      state.loading = true;
    },
    getSucceeded: (state, action: PayloadAction<ListResponseNotif>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    unshiftNotify: (state, action: PayloadAction<Notify>) => {
      state.data = {
        ...state.data,
        notify: [action.payload, ...state.data!.notify],
      } as NotifyResponse;
    },
    readAll: (state) => {
      state.loading = true;
    },
    readAllSucceeded: (state) => {
      state.loading = false;
    },
    readAllFailed: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = action.payload;
    },
    read: (state, action: PayloadAction<string>) => {
      state.loading = true;
    },
    readSucceeded: (state) => {
      state.loading = false;
    },
    readFailed: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});

//action
export const notifyActions = notifySlice.actions;

//seletors
export const selectDataNotify = (state: RootState) => state.notify.data;
export const selectLoadingNotify = (state: RootState) => state.notify.loading;
export const selectFilterNotify = (state: RootState) => state.notify.filter;
export const selectPaginationNotify = (state: RootState) =>
  state.notify.pagination;

//reducer
const notifyReducer = notifySlice.reducer;
export default notifyReducer;
