import React from "react";
import { render } from "react-dom";
import { Button } from "reakit/Button";
import "./styles.css";

function App() {
  return (
    <div className="bg-background1 h-full pt-8">
      <div className="flex justify-center">
        <div className="bg-white w-9/12 max-w-lg flex justify-center shadow-md py-10 px-10">
          <form className="w-full">
            <div className="mb-4 w-full">
              <label className="block mb-1" for="email-input">
                Email
              </label>
              <input
                className="border border-gray-500 w-full"
                type="text"
                id="email-input"
                value=""
              />
            </div>

            <div className="mb-8 w-full">
              <label className="block mb-1" for="password-input">
                Password
              </label>
              <input
                className="border border-gray-500 w-full"
                type="password"
                id="password-input"
                value=""
              />
            </div>

            <div className="flex justify-center w-full">
              <Button
                type="submit"
                className="bg-button text-white uppercase px-6 py-2 rounded-sm"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
