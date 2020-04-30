import React, { useRef } from "react";
import { Button } from "reakit/Button";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";
import { loginMachine, machineOptions } from "./machine";

function LoginPage() {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleEmailInputFocus = () => {
    requestAnimationFrame(() => {
      emailInputRef.current.focus();
    });
  };

  const handlePasswordInputFocus = () => {
    requestAnimationFrame(() => {
      passwordInputRef.current.focus();
    });
  };

  const machine = Machine(
    loginMachine,
    machineOptions(handleEmailInputFocus, handlePasswordInputFocus)
  );
  const [current, send] = useMachine(machine);

  const handleSubmit = (e) => {
    e.preventDefault();
    send({ type: "SUBMIT" });
  };
  const handleEmailChange = (e) =>
    send({ type: "INPUT_EMAIL", value: e.target.value });
  const handlePasswordChange = (e) =>
    send({ type: "INPUT_PASSWORD", value: e.target.value });

  if (current.matches("success")) {
    return <h1>Logged in!</h1>;
  }

  return (
    <div className="flex justify-center font-body font-light">
      <div className="bg-white w-9/12 max-w-lg flex justify-center flex-col shadow-md py-10 px-10">
        <form className="w-full mb-4" onSubmit={handleSubmit}>
          <div className="mb-4 w-full">
            <label
              className={`block mb-1 ${
                current.matches("ready.email.error") ? "text-red-600" : ""
              }`}
              htmlFor="email-input"
            >
              Email
            </label>
            <input
              className="border border-gray-500 w-full"
              type="text"
              id="email-input"
              value={current.context.email}
              onChange={handleEmailChange}
              ref={emailInputRef}
            />
          </div>

          <div className="mb-8 w-full">
            <label
              className={`block mb-1 ${
                current.matches("ready.password.error") ? "text-red-600" : ""
              }`}
              htmlFor="password-input"
            >
              Password
            </label>
            <input
              className="border border-gray-500 w-full"
              type="password"
              id="password-input"
              value={current.context.password}
              onChange={handlePasswordChange}
              ref={passwordInputRef}
            />
          </div>

          <div className="flex justify-center w-full">
            <Button
              disabled={current.matches("waitingResponse")}
              type="submit"
              className={`bg-button text-white uppercase px-6 py-2 rounded-sm font-body font-light ${
                current.matches("waitingResponse")
                  ? "cursor-wait opacity-50"
                  : ""
              }`}
            >
              Login
            </Button>
          </div>
        </form>

        <div className="text-red-600 text-center">
          {current.matches("ready.email.error") && "Email cannot be empty"}
          {current.matches("ready.password.error") &&
            "Password cannot be empty"}
          {current.matches("ready.authService.error.timeout") &&
            "An error occurred while logging in. Try again later."}
          {current.matches("ready.authService.error.loginFailed") &&
            "This email/password combination is not found - please try again"}
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
