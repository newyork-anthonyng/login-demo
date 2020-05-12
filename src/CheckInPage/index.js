import React from "react";
import Todos from "./Todos/index";
import Mood from "./Mood/index";
import machine from "./machine";
import { useMachine } from "@xstate/react";
import { Redirect } from "react-router-dom";

function CheckInPage() {
  const [state, send] = useMachine(machine);
  const { moods, todos } = state.context;

  const handleSubmitClick = () => {
    send({ type: "SUBMIT" });
  };

  if (state.matches("success")) {
    return <Redirect to="/feed" />;
  }
  return (
    <div>
      <div>
        <Mood moodRef={moods.ref} />
      </div>

      <div>
        <Todos todosRef={todos.ref} />
      </div>

      <button onClick={handleSubmitClick}>Check in</button>
      {state.matches("ready.mood.error") && (
        <p>Please tell us how you're doing. Select a mood</p>
      )}
      {state.matches("ready.todos.error") && (
        <p>Please tell us what you're going to do today.</p>
      )}
      <pre>{JSON.stringify(todos.todos, null, 2)}</pre>
      <pre>{JSON.stringify(moods.emotions, null, 2)}</pre>
    </div>
  );
}

export default CheckInPage;
