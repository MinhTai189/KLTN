import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

const initialState = {
  open: 0,
};

const createPostModalSlice = createSlice({
  name: 'created-post',
  initialState,
  reducers: {
    setShowModal: (state, action: PayloadAction<number>) => {
      state.open = action.payload;
    },
  },
});

//actions
export const createPostModalActions = createPostModalSlice.actions;

//selectors
export const selectOpenCreatedPostModal = (state: RootState) =>
  state.createdPostModal.open;

//reducer
const createdPostReducer = createPostModalSlice.reducer;
export default createdPostReducer;
