import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Filter, School } from 'models';

interface SchoolState {
  data: School[];
  loading: boolean;
}

const initialState: SchoolState = {
  data: [],
  loading: false,
};

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    getSchool(state) {
      state.loading = true;
    },
    getSchoolSuccess(state, action: PayloadAction<Array<School>>) {
      state.loading = false;
      state.data = action.payload;
    },
    getSchoolFailed(state) {
      state.loading = false;
    },
  },
});

//actions
export const schoolActions = schoolSlice.actions;

//selectors
export const selectDataSchool = (state: RootState) => state.school.data;
export const selectLoadingSchool = (state: RootState) => state.school.loading;

//reducer
const schoolReducer = schoolSlice.reducer;
export default schoolReducer;
