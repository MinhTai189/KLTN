import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filter, ListResponse, Pagination, User, UserUpdate } from 'models';

interface UsersState {
  loading: boolean;
  data: User[];
  error: string;
  filter: Filter;
  pagination: Pagination;
}

const initialState: UsersState = {
  loading: false,
  data: [],
  error: '',
  filter: {
    _page: 1,
    _limit: 15,
  },
  pagination: {
    _page: 1,
    _limit: 15,
    _totalRows: 15,
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUser(state: UsersState, action: PayloadAction<Filter>) {
      state.loading = true;
    },
    getUserSuccess(
      state: UsersState,
      action: PayloadAction<ListResponse<User>>
    ) {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getUserFailed(state: UsersState, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    removeUser(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    removeUserSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.filter = { ...state.filter };
    },
    removeUserFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateUser(state, action: PayloadAction<UserUpdate>) {
      state.loading = true;
    },
    updateUserSuccess(state, action: PayloadAction<UserUpdate>) {
      state.loading = false;
      state.filter = { ...state.filter };
    },
    updateUserFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    searchWithDebounce(state, action: PayloadAction<Filter>) {},
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
});

//actions

export const userActions = userSlice.actions;

//selectors

export const selectLoading = (state: any) => state.users.loading;
export const selectData = (state: any) => state.users.data;
export const selectFilter = (state: any) => state.users.filter;
export const selectPagination = (state: any) => state.users.pagination;
export const selectError = (state: any) => state.users.error;

//reducer
const userReducer = userSlice.reducer;
export default userReducer;
