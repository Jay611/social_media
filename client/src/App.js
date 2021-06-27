import { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { GlobalState } from "./GlobalState";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";

function App() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {token ? <Home /> : <Login />}
        </Route>
        <Route path="/login">{token ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {token ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/profile/:username">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
