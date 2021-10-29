import { ThemeProvider } from '@material-ui/core';
import 'antd/dist/antd.css';
import { AdminRoute, NotFound, ScrollToTop } from 'components/Common';
import { AdminLayout } from 'components/Layouts';
import HomePage from 'pages/HomePage';
import MotelDetailPage from 'pages/MotelDetailPage';
import MotelPage from 'pages/MotelPage';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { themeMUI } from 'utils';
import Auth from "./features/auth";

function App() {

  return (
    <ThemeProvider theme={themeMUI}>
      <ScrollToTop>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>

          <Route path="/motels/:id">
            <MotelDetailPage />
          </Route>

          <Route path="/motels">
            <MotelPage />
          </Route>

          <Route path="/auth">
            <Auth />
          </Route>

          <AdminRoute path="/admin">
            <AdminLayout />
          </AdminRoute>

          <Route>
            <NotFound />
          </Route>
        </Switch>
      </ScrollToTop>
    </ThemeProvider>
  );
}

export default App;
