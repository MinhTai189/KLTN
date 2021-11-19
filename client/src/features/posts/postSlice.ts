import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Post } from 'models';
import { DataPostFinal } from './components/CreatePost/models/create-post';

interface State {
  listData: Post[];
  data: Post | null;
  loading: boolean;
  err: string;
}

const initialState: State = {
  listData: [],
  data: null,
  loading: false,
  err: '',
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
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
  },
});

//action
export const postAction = postSlice.actions;

//selectors
export const selectListDataPost = (state: RootState) => state.post.listData;
export const selectDataPost = (state: RootState) => state.post.data;
export const selectLoadingPost = (state: RootState) => state.post.loading;
export const selectErrPost = (state: RootState) => state.post.err;

//reducer

const postReducer = postSlice.reducer;
export default postReducer;
