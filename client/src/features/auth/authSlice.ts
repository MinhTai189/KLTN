import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'models';
import { LoginData } from './models';

interface AuthState {
  isLogged: boolean;
  loading: boolean;
  currentUser?: User;
}

const initialState: AuthState = {
  isLogged: false,
  loading: false,
  currentUser: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginData>) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isLogged = true;
      state.currentUser = action.payload;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
    },
    logout: (state) => {
      state.isLogged = false;
      state.currentUser = undefined;
    },
  },
});

//actions
export const authActions = authSlice.actions;

//selectors
export const selectIsLogged = (state: any) => state.auth.isLogged;
export const selectLoading = (state: any) => state.auth.loading;
export const selectCurrentUser = (state: any) => state.auth.currentUser;

//reducer
const authReducer = authSlice.reducer;
export default authReducer;
