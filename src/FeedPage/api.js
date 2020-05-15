import { Server, Response } from "miragejs";

let server = new Server();
server.get("/feed", function (schema, request) {
  if (window.location.href.includes("fail=true")) {
    return new Response(401);
  }

  return {
    data: [
      {
        user: "Anthony Ng",
        mood: "😇",
        text: `Something I am going to do today #1; Something I am going to do today #2; Something I am going to do today #3
            Just in case it goes into a second line`,
      },
      {
        user: "Gaby Chan",
        mood: "😇",
        text: `Play Animal Crossing`,
      },
    ],
  };
});

const TIMEOUT_CODE = 1;

function fetchFeed(email, password) {
  return new Promise((resolve, reject) => {
    fetch("/feed", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          return reject({ code: TIMEOUT_CODE });
        }
        return response.json();
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => reject({ code: TIMEOUT_CODE }));
  });
}

export { fetchFeed, TIMEOUT_CODE };
