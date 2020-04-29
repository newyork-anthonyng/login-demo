import React from "react";
import { Button } from "reakit/Button";
import { Machine } from "xstate";

const loginMachine = Machine({
  id: "login",
  initial: "ready",
  states: {
    ready: {
      type: "parallel",
      initial: {
        email: {},
        password: {},
      },
    },
  },
});

function LoginPage() {
  return (
    <div className="flex justify-center font-body font-light">
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
              className="bg-button text-white uppercase px-6 py-2 rounded-sm font-body font-light"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
