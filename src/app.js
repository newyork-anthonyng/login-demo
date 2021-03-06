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
import FeedPage from "./FeedPage/index";

import "./styles.css";

function App() {
  return (
    <Router>
      <div className="bg-background1 h-full">
        <nav className="bg-purple-800 text-white p-4 mb-4">
          <ul>
            <li>For debugging:</li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/daily-check-in">Daily Check In</Link>
            </li>
            <li>
              <Link to="/feed">Daily Feed</Link>
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

          <Route path="/feed">
            <FeedPage />
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
