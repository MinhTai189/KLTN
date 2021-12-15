import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Filter, ListResponse, Pagination, Report } from 'models';

interface State {
  data: Report[] | undefined;
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

const reportApproveSlice = createSlice({
  name: 'rate-approve',
  initialState,
  reducers: {
    get(state, action: PayloadAction<Filter>) {
      state.loading = true;
    },
    getSucceeded(state, action: PayloadAction<ListResponse<Report>>) {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getFailded(state, action: PayloadAction<string>) {
      state.loading = false;
      state.err = action.payload;
    },
  },
});

//actions
export const reportApproveActions = reportApproveSlice.actions;

//selectors
export const selectDataReportApprove = (state: RootState) =>
  state.reportApprove.data;
export const selectPaginationReportApprove = (state: RootState) =>
  state.reportApprove.pagination;
export const selectFilterReportApprove = (state: RootState) =>
  state.reportApprove.filter;
export const selectLoadingReportApprove = (state: RootState) =>
  state.reportApprove.loading;

//reducer
const reportApproveReducer = reportApproveSlice.reducer;
export default reportApproveReducer;
