import React from "react";
import { render } from "react-dom";
import "./styles.css";

function App() {
  return <h1>Hello World</h1>;
}

render(<App />, document.querySelector(".js-root"));
