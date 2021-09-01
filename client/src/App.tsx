import { ThemeProvider } from '@material-ui/core';
import { NotFound } from 'components/Common';
import { HomeLayout } from 'components/Layouts';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { themeMUI } from 'utils';
import Auth from "./features/auth";

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

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
