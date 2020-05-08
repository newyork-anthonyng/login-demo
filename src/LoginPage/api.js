import { Server, Response } from "miragejs";

let server = new Server();
server.post("/login", function (schema, request) {
  let attrs = JSON.parse(request.requestBody);
  if (attrs.email === "admin") {
    return {};
  }
  return new Response(401);
});

const LOGIN_FAILED_CODE = 1;
const TIMEOUT_CODE = 2;

function login(email, password) {
  return new Promise((resolve, reject) => {
    fetch("/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          return reject({ code: LOGIN_FAILED_CODE });
        } else if (!response.ok) {
          return reject({ code: TIMEOUT_CODE });
        }
        resolve();
      })
      .catch(() => reject({ code: TIMEOUT_CODE }));
  });
}

export { login, LOGIN_FAILED_CODE, TIMEOUT_CODE };
