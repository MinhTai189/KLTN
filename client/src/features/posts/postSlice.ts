import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { FIND_ROOMMATE_ID, REVIEW_ID } from 'constant/constant';
import { Filter, Pagination, Post } from 'models';
import { DataPostFinal } from './components/CreatePost/models/create-post';

interface State {
  listData: Post[];
  data: Post | null;
  loading: boolean;
  filter: Filter;
  pagination: Pagination;
  err: string;
}

const initialState: State = {
  listData: [],
  data: null,
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
  err: '',
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    get: (state, action: PayloadAction<Filter>) => {
      state.loading = true;
    },
    getSucceeded: (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.listData = action.payload;
    },
    getFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.err = action.payload;
    },
    getById: (state, action: PayloadAction<string>) => {
      state.loading = true;
    },
    getByIdSucceeded: (state, action: PayloadAction<Post>) => {
      state.loading = false;
      state.data = action.payload;
    },
    getByIdFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.err = action.payload;
    },
    addPost: (state, action: PayloadAction<DataPostFinal>) => {
      state.loading = true;
    },
    addPostSuccess: (state) => {
      state.loading = false;
    },
    addPostFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.err = action.payload;
    },
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});

//action
export const postAction = postSlice.actions;

//selectors
export const selectListDataPost = (state: RootState) => state.post.listData;
export const selectDataPost = (state: RootState) => state.post.data;
export const selectLoadingPost = (state: RootState) => state.post.loading;
export const selectFilterPost = (state: RootState) => state.post.filter;
export const selectPaginationPost = (state: RootState) => state.post.pagination;
export const selectErrPost = (state: RootState) => state.post.err;

export const selectFindRoommatePost = createSelector(
  selectListDataPost,
  (listPost: Post[]) => {
    return listPost.filter((post) => post.subject._id === FIND_ROOMMATE_ID);
  }
);

export const selectReviewPost = createSelector(
  selectListDataPost,
  (listPost: Post[]) => {
    return listPost.filter((post) => post.subject._id === REVIEW_ID);
  }
);

//reducer

const postReducer = postSlice.reducer;
export default postReducer;
