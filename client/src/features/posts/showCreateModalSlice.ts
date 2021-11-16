import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

const initialState = {
  isOpen: false,
};

const showCreateModalSlice = createSlice({
  name: 'showCreateModal',
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

//actions
export const showCreateModalAction = showCreateModalSlice.actions;

//selectors
export const selectStatusCreateModal = (state: RootState) =>
  state.showCreateModal.isOpen;

//reducer
const showCreateModalReducer = showCreateModalSlice.reducer;
export default showCreateModalReducer;
