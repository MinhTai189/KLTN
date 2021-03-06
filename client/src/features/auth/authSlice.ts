import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Notify, User } from 'models';
import { LoginData } from './models';

interface AuthState {
  isLogged: boolean;
  loading: boolean;
  error: string;
  currentUser?: User;
  countLoginWrong: number;
}

const initialState: AuthState = {
  isLogged: false,
  loading: false,
  currentUser: undefined,
  error: '',
  countLoginWrong: 0,
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
    logout: (state) => {},
    logoutSuccess: (state) => {
      state.isLogged = false;
      state.currentUser = undefined;
    },
    likeMotel(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    likeMotelSuccess(state, action: PayloadAction<string>) {
      const favoriteMotel = state.currentUser?.favorite || [];

      state.loading = false;
      state.currentUser = {
        ...state.currentUser,
        favorite: [...favoriteMotel, action.payload],
      } as User;
    },
    likeMotelFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    unlikeMotel(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    unlikeMotelSuccess(state, action: PayloadAction<string>) {
      let favoriteMotel = state.currentUser?.favorite || [];
      favoriteMotel = favoriteMotel.filter((x) => x !== action.payload);

      state.loading = false;
      state.currentUser = {
        ...state.currentUser,
        favorite: favoriteMotel,
      } as User;
    },
    unlikeMotelFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setNotify(state, action: PayloadAction<Notify>) {
      if (!state.currentUser || !state.currentUser.notify) return;

      state.currentUser = {
        ...state.currentUser,
        notify: [action.payload, ...state.currentUser.notify],
      };
    },
    setReadOneNotify: (state, action: PayloadAction<string>) => {
      if (!state.currentUser || !state.currentUser.notify) return;

      const newNotifies = state.currentUser.notify.map((notify) => {
        if (notify._id === action.payload)
          return {
            ...notify,
            read: true,
          };
        return notify;
      });

      state.currentUser = {
        ...state.currentUser,
        notify: newNotifies,
      };
    },
    setReadAllNotify: (state) => {
      if (!state.currentUser || !state.currentUser.notify) return;

      const newNotifies = state.currentUser.notify.map((notify) => ({
        ...notify,
        read: true,
      }));

      state.currentUser = {
        ...state.currentUser,
        notify: newNotifies,
      };
    },
    increaseCountLoginWrong(state) {
      state.countLoginWrong++;
    },
  },
});

//actions
export const authActions = authSlice.actions;

//selectors
export const selectIsLogged = (state: RootState) => state.auth.isLogged;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectErr = (state: RootState) => state.auth.error;
export const selectCountLoginWrong = (state: RootState) =>
  state.auth.countLoginWrong;

export const selectUpdateUserData = createSelector(
  selectCurrentUser,
  (currentUser: any) => {
    if (!currentUser) return;

    return {
      avatarUrl: currentUser.avatarUrl,
      name: currentUser.name,
      email: currentUser.email,
      province: currentUser.province.codeName,
      district: currentUser.district.codeName,
      school: currentUser.school.codeName,
    };
  }
);

//reducer
const authReducer = authSlice.reducer;
export default authReducer;
