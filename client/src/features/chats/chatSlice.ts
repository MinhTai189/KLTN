import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import {
  AddChatMessage,
  AddGroup,
  AddLastMessage,
  AddListOnline,
  ChatGroup,
  ChatMessage,
  Filter,
  ListResponse,
  Pagination,
} from 'models';

interface State {
  listGroup: ChatGroup[];
  refetchGroup: boolean;
  listMessage: ChatMessage[];
  filterMessage: Filter;
  paginationMessage: Pagination;
  totalUnseen: number;
  loading: boolean;
  err: string;
}

export const iniFilterMessage: Filter = {
  _page: 1,
  _limit: 20,
};

const initialState: State = {
  listGroup: [],
  refetchGroup: false,
  listMessage: [],
  filterMessage: iniFilterMessage,
  paginationMessage: {
    _page: 1,
    _limit: 20,
    _totalRows: 20,
  },
  totalUnseen: 0,
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
    changeLastMessageGroup(state, action: PayloadAction<AddLastMessage>) {
      const newListGroup = state.listGroup.map((group) => {
        if (group._id === action.payload.groupId)
          return {
            ...group,
            lastMessage: action.payload.message,
          };

        return group;
      });

      state.listGroup = newListGroup;
    },
    updateListOnlineGroup(state, action: PayloadAction<AddListOnline>) {
      const newListGroup = state.listGroup.map((group) => {
        if (group._id === action.payload.groupId)
          return {
            ...group,
            ononlines: action.payload.list,
          };

        return group;
      });

      state.listGroup = newListGroup;
    },
    addChatMessage(state, action: PayloadAction<AddChatMessage>) {
      state.loading = true;
    },
    addChatMessageSucceeded(state) {
      state.loading = false;
    },
    addChatMessageFailed(state, action: PayloadAction<string>) {
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
    appendNewMessage(state, action: PayloadAction<ChatMessage>) {
      state.listMessage.push(action.payload);
    },
    setFilterMessage(state, action: PayloadAction<Filter>) {
      state.filterMessage = action.payload;
    },
    resetFilterMessage(state) {
      const temp = { ...state.filterMessage };
      state.filterMessage = temp;
    },
    refetchChatGroup(state) {
      state.refetchGroup = !state.refetchGroup;
    },
    setTotalUnseen(state, action: PayloadAction<number>) {
      state.totalUnseen = action.payload;
    },
  },
});

//actions
export const chatActions = chatSlice.actions;

//selectors
export const selectListGroupChat = (state: RootState) => state.chat.listGroup;
export const selectRefetchGroupChat = (state: RootState) =>
  state.chat.refetchGroup;
export const selectLoadingChat = (state: RootState) => state.chat.loading;
export const selectListMessageChat = (state: RootState) =>
  state.chat.listMessage;
export const selectFilterMessageChat = (state: RootState) =>
  state.chat.filterMessage;
export const selectPaginationMessageChat = (state: RootState) =>
  state.chat.paginationMessage;
export const selectTotalUnseenMessageChat = (state: RootState) =>
  state.chat.totalUnseen;

//reducer
const chatReducer = chatSlice.reducer;
export default chatReducer;
