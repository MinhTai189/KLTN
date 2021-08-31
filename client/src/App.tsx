import axiosClient from 'api/axiosClient';
import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Auth from "./features/auth";
function App() {

  useEffect(() => {
    (async function autoLogin() {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        await axiosClient.post('/login', {
          accessToken
        })
      }
    })()
  }, [])

  return (
    <Switch>
      <Route path="/" exact>
        <h1>This is a home page</h1>
      </Route>

      <Route path="/auth">
        <Auth />
      </Route>
    </Switch>
  );
}

export default App;
