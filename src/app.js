import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { render } from "react-dom";
import LoginPage from "./LoginPage/index";
import CheckInPage from "./CheckInPage/index";

import "./styles.css";

function App() {
  return (
    <Router>
      <div className="bg-background1 h-full pt-8">
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/daily-check-in">Daily Check In</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>

          <Route path="/daily-check-in">
            <CheckInPage />
          </Route>

          <Route>
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

render(<App />, document.querySelector(".js-root"));
