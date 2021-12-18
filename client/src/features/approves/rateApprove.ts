import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Filter, ListResponse, Pagination, Rate } from 'models';

interface State {
  data: Rate[] | undefined;
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

const rateApproveSlice = createSlice({
  name: 'rate-approve',
  initialState,
  reducers: {
    get(state, action: PayloadAction<Filter>) {
      state.loading = true;
    },
    getSucceeded(state, action: PayloadAction<ListResponse<Rate>>) {
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
      state.filter = action.payload;
    },
  },
});

//actions
export const rateApproveActions = rateApproveSlice.actions;

//selectors
export const selectDataRateApprove = (state: RootState) =>
  state.rateApprove.data;
export const selectPaginationRateApprove = (state: RootState) =>
  state.rateApprove.pagination;
export const selectFilterRateApprove = (state: RootState) =>
  state.rateApprove.filter;
export const selectLoadingRateApprove = (state: RootState) =>
  state.rateApprove.loading;

//reducer
const rateApproveReducer = rateApproveSlice.reducer;
export default rateApproveReducer;
