import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import {
  AddGroup,
  ChatGroup,
  ChatMessage,
  Filter,
  ListResponse,
  Pagination,
} from 'models';

interface State {
  listGroup: ChatGroup[];
  listMessage: ChatMessage[];
  filterMessage: Filter;
  paginationMessage: Pagination;
  loading: boolean;
  err: string;
}

export const iniFilterMessage: Filter = {
  _page: 1,
  _limit: 20,
};

const initialState: State = {
  listGroup: [],
  listMessage: [],
  filterMessage: iniFilterMessage,
  paginationMessage: {
    _page: 1,
    _limit: 20,
    _totalRows: 20,
  },
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
    getChatMessage(state, action: PayloadAction<Filter>) {
      state.loading = true;
    },
    getChatMessageSucceeded(
      state,
      action: PayloadAction<ListResponse<ChatMessage>>
    ) {
      state.loading = false;
      state.listMessage = action.payload.data;
      state.paginationMessage = action.payload.pagination;
    },
    getChatMessageFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.err = action.payload;
    },
    setFilterMessage(state, action: PayloadAction<Filter>) {
      state.filterMessage = action.payload;
    },
  },
});

//actions
export const chatActions = chatSlice.actions;

//selectors
export const selectListGroupChat = (state: RootState) => state.chat.listGroup;
export const selectLoadingChat = (state: RootState) => state.chat.loading;
export const selectListMessageChat = (state: RootState) =>
  state.chat.listMessage;
export const selectFilterMessageChat = (state: RootState) =>
  state.chat.filterMessage;
export const selectPaginationMessageChat = (state: RootState) =>
  state.chat.paginationMessage;

//reducer
const chatReducer = chatSlice.reducer;
export default chatReducer;
