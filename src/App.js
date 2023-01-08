import Board from "./components/board/Board";
import Games from "./pages/games/Games";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import NewGame from "./components/newGame/NewGame";
import Connect from "./components/connect/Connect";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">{currentUser ? <Games /> : <Login />}</Route>
        <Route path="/register">{currentUser ? <Games /> : <Register />}</Route>
        <Route path="/board">
          <Board />
        </Route>
        <Route path="/games">
          <Games />
        </Route>
        <Route path="/newGame">
          <Connect />
        </Route>
      </Switch>
    </Router>
  );
};
export default App;
