import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'models';
import { LoginData } from './models';

interface AuthState {
  isLogged: boolean;
  loading: boolean;
  error: string;
  currentUser?: User;
}

const initialState: AuthState = {
  isLogged: false,
  loading: false,
  currentUser: undefined,
  error: '',
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
      state.error = action.payload;
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
export const selectErr = (state: any) => state.auth.error;

//reducer
const authReducer = authSlice.reducer;
export default authReducer;
