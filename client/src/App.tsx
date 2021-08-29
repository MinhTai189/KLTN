import { Switch, Route } from 'react-router-dom'
import Auth from "./features/auth"



function App() {
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
