import { assign } from "xstate";
import { LOGIN_FAILED_CODE, TIMEOUT_CODE, login } from "./api";

const loginMachine = {
  id: "login",
  initial: "ready",
  context: { email: "", password: "" },
  on: {
    INPUT_EMAIL: {
      actions: "cacheEmail",
      target: "ready.email.noError",
    },
    INPUT_PASSWORD: {
      actions: "cachePassword",
      target: "ready.password.noError",
    },
    SUBMIT: [
      { cond: "isEmailEmpty", target: "ready.email.error" },
      { cond: "isPasswordEmpty", target: "ready.password.error" },
      { target: "waitingResponse" },
    ],
  },
  states: {
    ready: {
      type: "parallel",
      states: {
        email: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              initial: "empty",
              states: { empty: {} },
            },
          },
          onEntry: "focusEmailInput",
        },
        password: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              initial: "empty",
              states: { empty: {} },
            },
          },
          onEntry: "focusPasswordInput",
        },
        authService: {
          initial: "noError",
          states: {
            noError: {},
            error: {
              initial: "timeout",
              states: {
                timeout: {
                  on: {
                    SUBMIT: "#login.waitingResponse",
                  },
                },
                loginFailed: {},
              },
            },
          },
        },
      },
    },
    waitingResponse: {
      invoke: {
        src: "requestLogin",
        onDone: {
          actions: "onSuccess",
          target: "success",
        },
        onError: [
          {
            cond: "isLoginFailed",
            target: "ready.authService.error.loginFailed",
          },
          {
            cond: "isTimeout",
            target: "ready.authService.error.timeout",
          },
        ],
      },
    },
    success: { type: "final" },
  },
};
const machineOptions = (handleEmailInputFocus, handlePasswordInputFocus) => ({
  guards: {
    isEmailEmpty: (context, _event) => context.email.length === 0,
    isPasswordEmpty: (context, _event) => context.password.length === 0,
    isTimeout: (_context, event) => {
      return event.data.code === TIMEOUT_CODE;
    },
    isLoginFailed: (_context, event) => {
      return event.data.code === LOGIN_FAILED_CODE;
    },
  },
  actions: {
    cacheEmail: assign({ email: (_context, event) => event.value }),
    cachePassword: assign({ password: (_context, event) => event.value }),
    focusEmailInput: handleEmailInputFocus,
    focusPasswordInput: handlePasswordInputFocus,
  },
  services: {
    requestLogin: (context, _event) => login(context.email, context.password),
  },
});

export { loginMachine, machineOptions };
