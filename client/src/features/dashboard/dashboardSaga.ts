import dashboardApis from 'api/dashboard';
import { RecentData, Response, Statistic } from 'models';
import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  Charts,
  dashboardActions,
  DashboardList,
  Doughnut,
} from './dashboardSlice';

function* handleGetStatistic() {
  try {
    const response: Response<Statistic> = yield dashboardApis.getStatistic();

    yield put(dashboardActions.setStatistic(response.data));
  } catch (error: any) {
    yield call(toast.error, error.response.data.message);
  }
}

function* handleGetChart() {
  try {
    const response: Response<any> = yield dashboardApis.getChart();

    const data: Charts = {
      registerdAccount: response.data.account,
      totalMotelEveryMonth: response.data.approvalMotel,
      totalPostEveryMonth: response.data.approvalPost,
    };

    yield put(dashboardActions.setChart(data));
  } catch (error: any) {
    yield call(toast.error, error.response.data.message);
  }
}

function* handleGetDoughnuts() {
  try {
    const response: Response<any> = yield dashboardApis.getDataDoughnut();

    const data: Doughnut = {
      size: response.data.size,
      ratioPost: response.data.subjects,
    };

    yield put(dashboardActions.setDoughnut(data));
  } catch (error: any) {
    yield call(toast.error, error.response.data.message);
  }
}

function* handleGetRecents() {
  try {
    const response: Response<RecentData> = yield dashboardApis.getRecentData();

    yield put(dashboardActions.setRecents(response.data));
  } catch (error: any) {
    yield call(toast.error, error.response.data.message);
  }
}

function* handleGetList() {
  try {
    const response: Response<any> =
      yield dashboardApis.getListOnlinePermission();

    const data: DashboardList = {
      onlines: response.data.ononlines.list,
      importants: response.data.importantUsers,
    };

    yield put(dashboardActions.setList(data));
  } catch (error: any) {
    yield call(toast.error, error.response.data.message);
  }
}

function* handleGetData() {
  try {
    yield all([
      call(handleGetStatistic),
      call(handleGetChart),
      call(handleGetDoughnuts),
      call(handleGetRecents),
      call(handleGetList),
    ]);

    yield put(dashboardActions.getSucceeded());
  } catch (error) {
    yield put(dashboardActions.getDataFailed());
  }
}

export default function* dashboardSaga() {
  yield takeLatest(dashboardActions.getData, handleGetData);
}
