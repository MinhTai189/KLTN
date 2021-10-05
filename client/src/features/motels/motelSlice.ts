import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import {
  Filter,
  ListResponse,
  Motel,
  MotelOnly,
  Pagination,
  Room,
} from 'models';

interface MotelState {
  loading: boolean;
  data: Motel[];
  pagination: Pagination;
  filter: Filter;
  error: string;
}

const initialState: MotelState = {
  loading: false,
  data: [],
  pagination: {
    _page: 1,
    _limit: 15,
    _totalRows: 15,
  },
  filter: {
    _page: 1,
    _limit: 15,
  },
  error: '',
};

const motelSlice = createSlice({
  name: 'motels',
  initialState,
  reducers: {
    getMotel: (state, action: PayloadAction<Filter>) => {
      state.loading = true;
    },
    getMotelRandom: (state, action: PayloadAction<Filter>) => {
      state.loading = true;
    },
    getMotelSuccess: (state, action: PayloadAction<ListResponse<Motel>>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    getMotelFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addMotel: (state, action: PayloadAction<Motel>) => {
      state.loading = true;
    },
    addMotelSuccess: (state) => {
      state.loading = false;
      state.filter = { ...state.filter };
    },
    addMotelFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMotel: (state, action: PayloadAction<MotelOnly>) => {
      state.loading = true;
    },
    updateMotelSuccess: (state) => {
      state.loading = false;
      state.filter = { ...state.filter };
    },
    updateMotelFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeMotel(state, action: PayloadAction<string>) {
      state.loading = true;
    },
    removeMotelSuccess(state) {
      state.loading = false;
      state.filter = { ...state.filter };
    },
    removeMotelFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
    searchWithDebounce: (state, action: PayloadAction<Filter>) => {},
    updateRoom: (state, action: PayloadAction<Room>) => {
      state.loading = true;
    },
    updateRoomSuccess: (state) => {
      state.loading = false;
      state.filter = { ...state.filter };
    },
    updateRoomFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

//actions
export const motelActions = motelSlice.actions;

//selectors
export const selectLoadingMotel = (state: RootState) => state.motels.loading;
export const selectDataMotel = (state: RootState) => state.motels.data;
export const selectFilterMotel = (state: RootState) => state.motels.filter;
export const selectPaginationMotel = (state: RootState) =>
  state.motels.pagination;

export const selectMotelSplited = createSelector(
  selectDataMotel,
  (dataMotel: Array<Motel>) => {
    return dataMotel.map((motel) => ({
      motel: {
        _id: motel._id,
        name: motel.name,
        images: motel.images,
        thumbnail: motel.thumbnail,
        desc: motel.desc,
        contact: motel.contact,
        status: motel.status === true ? 'yes' : 'no',
        available: motel.available,
        school: motel.school,
        address: motel.address,
      },
      room: motel.room,
    }));
  }
);

//reducer
const motelReducer = motelSlice.reducer;
export default motelReducer;
