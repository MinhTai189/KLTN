import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

const initialState = {
  loading: false,
  error: '',
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
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
  },
});

//action
export const notifyActions = notifySlice.actions;

//seletors
export const selectLoadingNotify = (state: RootState) => state.notify.loading;

//reducer
const notifyReducer = notifySlice.reducer;
export default notifyReducer;
