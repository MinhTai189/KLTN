import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Filter, ListResponse, Pagination, Post } from 'models';

interface State {
  data: Post[] | undefined;
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

const postApproveSlice = createSlice({
  name: 'post-approve',
  initialState,
  reducers: {
    get(state, action: PayloadAction<Filter>) {
      state.loading = true;
    },
    getSucceeded(state, action: PayloadAction<ListResponse<Post>>) {
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
export const postApproveActions = postApproveSlice.actions;

//selectors
export const selectDataPostApprove = (state: RootState) =>
  state.postApprove.data;
export const selectPaginationPostApprove = (state: RootState) =>
  state.postApprove.pagination;
export const selectFilterPostApprove = (state: RootState) =>
  state.postApprove.filter;
export const selectLoadingPostApprove = (state: RootState) =>
  state.postApprove.loading;

//reducer
const postApproveReducer = postApproveSlice.reducer;
export default postApproveReducer;
