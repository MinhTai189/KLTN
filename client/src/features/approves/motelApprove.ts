import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Filter, ListResponse, MotelApprove, Pagination } from 'models';

interface State {
  data: MotelApprove[] | undefined;
  loading: boolean;
  pagination: Pagination;
  filter: Filter;
  err: string;
}

const initialState: State = {
  data: undefined,
  loading: false,
  pagination: {
    _page: 1,
    _limit: 4,
    _totalRows: 4,
  },
  filter: {
    _page: 1,
    _limit: 4,
  },
  err: '',
};

const motelApproveSlice = createSlice({
  name: 'motel-approve',
  initialState,
  reducers: {
    get(state, action: PayloadAction<Filter>) {
      state.loading = true;
    },
    getSucceeded(state, action: PayloadAction<ListResponse<MotelApprove>>) {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getFailded(state, action: PayloadAction<string>) {
      state.loading = false;
      state.err = action.payload;
    },
    approve(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    approveSucceeded(state) {
      state.loading = false;
    },
    approveFailded(state, action: PayloadAction<string>) {
      state.loading = false;
      state.err = action.payload;
    },
    refuse(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    refuseSucceeded(state) {
      state.loading = false;
    },
    refuseFailded(state, action: PayloadAction<string>) {
      state.loading = false;
      state.err = action.payload;
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

//actions
export const motelApproveActions = motelApproveSlice.actions;

//selectors
export const selectDataMotelApprove = (state: RootState) =>
  state.motelApprove.data;
export const selectPaginationMotelApprove = (state: RootState) =>
  state.motelApprove.pagination;
export const selectFilterMotelApprove = (state: RootState) =>
  state.motelApprove.filter;
export const selectLoadingMotelApprove = (state: RootState) =>
  state.motelApprove.loading;

//reducer
const motelApproveReducer = motelApproveSlice.reducer;
export default motelApproveReducer;
