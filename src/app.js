import React from "react";
import { render } from "react-dom";
import LoginPage from "./LoginPage";

import "./styles.css";

function App() {
  return (
    <div className="bg-background1 h-full pt-8">
      <LoginPage />
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
