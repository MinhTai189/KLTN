import { ThemeProvider } from '@material-ui/core';
import 'antd/dist/antd.css';
import { AdminRoute, NotFound } from 'components/Common';
import { AdminLayout } from 'components/Layouts';
import HomePage from 'pages/Home/HomePage';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { themeMUI } from 'utils';
import Auth from "./features/auth";

function App() {

  return (
    <ThemeProvider theme={themeMUI}>
      <Switch>
        <Route path="/" exact>
          <HomePage />
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
