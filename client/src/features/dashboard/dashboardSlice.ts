import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import {
  Chart,
  Motel,
  RatioPost,
  RecentActivity,
  RecentData,
  Size,
  Statistic,
  User,
} from 'models';

export interface Charts {
  registerdAccount: Chart[];
  totalPostEveryMonth: Chart[];
  totalMotelEveryMonth: Chart[];
}

export interface Doughnut {
  size: Size | undefined;
  ratioPost: RatioPost[];
}

export interface DashboardList {
  onlines: User[];
  importants: User[];
}

export interface DashboardState {
  data: {
    statistics: Statistic | undefined;
    recents: RecentData;
    doughnut: Doughnut;
    chart: Charts;
    list: DashboardList;
  };
  loading: boolean;
  err: string;
}

const initialState: DashboardState = {
  data: {
    statistics: undefined,
    recents: {
      activities: [],
      motels: [],
    },
    doughnut: {
      size: undefined,
      ratioPost: [],
    },
    chart: {
      registerdAccount: [],
      totalMotelEveryMonth: [],
      totalPostEveryMonth: [],
    },
    list: {
      onlines: [],
      importants: [],
    },
  },
  loading: false,
  err: '',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    getData(state) {
      state.loading = true;
    },
    getSucceeded(state) {
      state.loading = false;
    },
    getDataFailed(state) {
      state.loading = false;
    },
    setStatistic(state, action: PayloadAction<Statistic>) {
      state.data.statistics = action.payload;
    },
    setChart(state, action: PayloadAction<Charts>) {
      state.data.chart = action.payload;
    },
    setDoughnut(state, action: PayloadAction<Doughnut>) {
      state.data.doughnut = action.payload;
    },
    setRecents(state, action: PayloadAction<RecentData>) {
      state.data.recents = action.payload;
    },
    setList(state, action: PayloadAction<DashboardList>) {
      state.data.list = action.payload;
    },
    setListOnline(state, action: PayloadAction<User[]>) {
      state.data.list.onlines = action.payload;
    },
    setRecentActivities(state, action: PayloadAction<RecentActivity[]>) {
      state.data.recents.activities = action.payload;
    },
    setRecentMotel(state, action: PayloadAction<Motel[]>) {
      state.data.recents.motels = action.payload;
    },
  },
});

//actions
export const dashboardActions = dashboardSlice.actions;

//selector
export const selectDataDashboard = (state: RootState) => state.dashboard.data;
export const selectLoadingDashboard = (state: RootState) =>
  state.dashboard.loading;
export const selectErrDashboard = (state: RootState) => state.dashboard.err;

//reducer
const dashboardReducer = dashboardSlice.reducer;
export default dashboardReducer;
