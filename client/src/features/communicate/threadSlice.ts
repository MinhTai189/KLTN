import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Thread } from 'models/Thread';

interface State {
  data: Thread[] | null;
  loading: boolean;
}

const initialState: State = {
  data: null,
  loading: false,
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    get: (state) => {
      state.loading = true;
    },
    getSucceeded: (state, action: PayloadAction<Thread[]>) => {
      state.loading = false;
      state.data = action.payload;
    },
    getFailded: (state) => {
      state.loading = false;
    },
  },
});

// actions
export const threadActions = threadSlice.actions;

// selectors
export const selectDataThread = (state: RootState) => state.thread.data;
export const selectLoadingThread = (state: RootState) => state.thread.loading;

//reducer
const threadReducer = threadSlice.reducer;
export default threadReducer;
