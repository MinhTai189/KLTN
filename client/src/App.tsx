import { ThemeProvider } from '@material-ui/core';
import { AdminRoute, NotFound } from 'components/Common';
import { AdminLayout, HomeLayout } from 'components/Layouts';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { themeMUI } from 'utils';
import Auth from "./features/auth";
import 'antd/dist/antd.css';

function App() {

  return (
    <ThemeProvider theme={themeMUI}>
      <Switch>
        <Route path="/" exact>
          <HomeLayout />
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
    </ThemeProvider>
  );
}

export default App;
