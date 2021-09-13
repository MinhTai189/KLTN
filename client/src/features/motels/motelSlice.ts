import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Filter, ListResponse, Motel, Pagination } from 'models';

interface MotelState {
  loading: boolean;
  data: Motel[];
  pagination: Pagination;
  filter: Filter;
  error: string;
}

const initialState: MotelState = {
  loading: false,
  data: [],
  pagination: {
    _page: 1,
    _limit: 15,
    _totalRows: 15,
  },
  filter: {
    _page: 1,
    _limit: 15,
  },
  error: '',
};

const motelSlice = createSlice({
  name: 'motels',
  initialState,
  reducers: {
    getMotel: (state, action: PayloadAction<Filter>) => {
      state.loading = true;
    },
    getMotelSuccess: (state, action: PayloadAction<ListResponse<Motel>>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getMotelFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});

//actions
export const motelActions = motelSlice.actions;

//selectors
export const selectLoadingMotel = (state: RootState) => state.motels.loading;
export const selectDataMotel = (state: RootState) => state.motels.data;
export const selectFilterMotel = (state: RootState) => state.motels.filter;
export const selectPaginationMotel = (state: RootState) =>
  state.motels.pagination;

//reducer
const motelReducer = motelSlice.reducer;
export default motelReducer;
