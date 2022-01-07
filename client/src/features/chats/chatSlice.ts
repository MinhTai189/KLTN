import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { AddGroup, ChatGroup } from 'models';

interface State {
  listGroup: ChatGroup[];
  loading: boolean;
  err: string;
}

const initialState: State = {
  listGroup: [],
  loading: false,
  err: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getChatGroup(state) {
      state.loading = true;
    },
    getChatGroupSucceeded(state, action: PayloadAction<ChatGroup[]>) {
      state.loading = false;
      state.listGroup = action.payload;
    },
    getChatGroupFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.err = action.payload;
    },
    addChatGroup(state, action: PayloadAction<AddGroup>) {
      state.loading = true;
    },
    addChatGroupSucceeded(state, action: PayloadAction<any>) {
      state.loading = false;
    },
    addChatGroupFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.err = action.payload;
    },
  },
});

//actions
export const chatActions = chatSlice.actions;

//selectors
export const selectListGroupChat = (state: RootState) => state.chat.listGroup;
export const selectLoadingChat = (state: RootState) => state.chat.loading;

//reducer
const chatReducer = chatSlice.reducer;
export default chatReducer;
