import { Province } from 'models';
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { mapOptions } from 'utils';

interface ProvinceState {
  data: Province[];
  loading: boolean;
  error: string;
}

const initialState: ProvinceState = {
  data: [],
  loading: false,
  error: '',
};

const provinceSlice = createSlice({
  name: 'province',
  initialState,
  reducers: {
    getAll: (state) => {
      state.loading = true;
    },
    getAllSucceed: (state, action: PayloadAction<Province[]>) => {
      state.loading = false;
      state.data = action.payload;
    },
    getAllFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

//actions
export const provinceActions = provinceSlice.actions;

//selectors
export const selectDataProvince = (state: RootState) => state.province.data;
export const selectLoadingProvince = (state: RootState) =>
  state.province.loading;
export const selectOptionsAutoCompProVince = createSelector(
  selectDataProvince,
  (listProvince: Province[]) => mapOptions.autoComp(listProvince)
);

//reducer
const provinceReducer = provinceSlice.reducer;
export default provinceReducer;
