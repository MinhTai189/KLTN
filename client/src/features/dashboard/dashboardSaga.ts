import dashboardApis from 'api/dashboard';
import { Response, Statistic } from 'models';
import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Charts, dashboardActions } from './dashboardSlice';

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

function* handleGetData() {
  try {
    yield all([call(handleGetStatistic), call(handleGetChart)]);

    yield put(dashboardActions.getSucceeded());
  } catch (error) {
    yield put(dashboardActions.getDataFailed());
  }
}

export default function* dashboardSaga() {
  yield takeLatest(dashboardActions.getData, handleGetData);
}
