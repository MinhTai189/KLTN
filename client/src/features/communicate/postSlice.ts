import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { DataPostFinal } from './components/CreatePost/models/create-post';

interface State {
  data: any;
  loading: boolean;
}

const initialState: State = {
  data: [],
  loading: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<DataPostFinal>) => {
      state.loading = true;
    },
    addPostSuccess: (state) => {
      state.loading = false;
    },
    addPostFailed: (state) => {
      state.loading = false;
    },
  },
});

//action
export const postAction = postSlice.actions;

//selectors
export const selectDataPost = (state: RootState) => state.post.data;
export const selectLoadingPost = (state: RootState) => state.post.loading;

//reducer

const postReducer = postSlice.reducer;
export default postReducer;
