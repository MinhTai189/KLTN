import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Filter, SchoolDropdown } from 'models';

interface SchoolState {
  data: SchoolDropdown[];
  loading: boolean;
  filter: Filter;
}

const initialState: SchoolState = {
  data: [],
  loading: false,
  filter: {},
};

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    getSchool(state, action: PayloadAction<Filter>) {
      state.loading = true;
    },
    getSchoolSuccess(state, action: PayloadAction<Array<SchoolDropdown>>) {
      state.loading = false;
      state.data = action.payload;
    },
    getSchoolFailed(state) {
      state.loading = false;
    },
    searchWithDebounce(state, action: PayloadAction<Filter>) {
      state.loading = true;
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
});

//actions
export const schoolActions = schoolSlice.actions;

//selectors
export const selectDataSchool = (state: RootState) => state.school.data;
export const selectLoadingSchool = (state: RootState) => state.school.loading;
export const selectFilterSchool = (state: RootState) => state.school.filter;

//reducer
const schoolReducer = schoolSlice.reducer;
export default schoolReducer;
