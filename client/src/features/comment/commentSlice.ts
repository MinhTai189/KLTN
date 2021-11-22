import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Comment, Filter, ListResponse, Pagination } from 'models';

interface State {
  data: Comment[];
  errMessage: string;
  loading: boolean;
  filter: Filter;
  pagination: Pagination;
}

const initialState: State = {
  data: [],
  errMessage: '',
  loading: false,
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

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    get: (state, action: PayloadAction<Filter>) => {
      state.loading = true;
    },
    getSucceeded: (state, action: PayloadAction<ListResponse<Comment>>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errMessage = action.payload;
    },
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
    // add: (state, action: PayloadAction<string>) => {
    //   state.loading = true;
    // },
    // addSucceeded: (state, action: PayloadAction<ListResponse<Comment>>) => {
    //   state.loading = false;
    //   state.data = action.payload.data;
    //   state.pagination = action.payload.pagination;
    // },
    // addFailed: (state, action: PayloadAction<string>) => {
    //   state.loading = false;
    //   state.errMessage = action.payload;
    // },
  },
});

//action
export const commentAction = commentSlice.actions;

//selectors
export const selectDataComment = (state: RootState) => state.comment.data;
export const selectLoadingComment = (state: RootState) => state.comment.loading;
export const selectFilterComment = (state: RootState) => state.comment.filter;
export const selectPaginationComment = (state: RootState) =>
  state.comment.pagination;

//reducer
const commentReducer = commentSlice.reducer;
export default commentReducer;
