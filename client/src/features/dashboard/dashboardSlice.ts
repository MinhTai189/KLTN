import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Chart, RecentActivities, Statistic, StatisticPost } from 'models';

export interface Charts {
  registerdAccount: Chart[];
  totalPostEveryMonth: Chart[];
  totalMotelEveryMonth: Chart[];
}

export interface DashboardState {
  data: {
    statistics: Statistic | undefined;
    recentActivities: RecentActivities[];
    doughnutPost: {
      statistics: StatisticPost[];
      total: number;
    };
    chart: Charts;
  };
  loading: boolean;
  err: string;
}

const initialState: DashboardState = {
  data: {
    statistics: undefined,
    recentActivities: [],
    doughnutPost: {
      statistics: [],
      total: 0,
    },
    chart: {
      registerdAccount: [],
      totalMotelEveryMonth: [],
      totalPostEveryMonth: [],
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
