import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

const initialState = {
  open: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    openLoading(state) {
      state.open = true;
    },
    closeLoading(state) {
      state.open = false;
    },
  },
});

//actions
export const loadingActions = loadingSlice.actions;

//selectors
export const selectStatusLoading = (state: RootState) => state.loading.open;

//reducer
const loadingReducer = loadingSlice.reducer;
export default loadingReducer;
