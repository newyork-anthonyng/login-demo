import React from "react";
import Todos from "./Todos/index";
import Mood from "./Mood/index";
import machine from "./machine";
import { useMachine } from "@xstate/react";
import { Redirect } from "react-router-dom";
import { Button } from "reakit/Button";

function CheckInPage() {
  const [state, send] = useMachine(machine);
  const { moods, todos, answerInput } = state.context;

  const handleSubmitClick = () => {
    send({ type: "SUBMIT" });
  };

  const handleAnswerInputChange = (e) => {
    send({ type: "INPUT_ANSWER", value: e.target.value });
  };

  if (state.matches("success")) {
    return <Redirect to="/feed" />;
  }
  return (
    <div className="px-8">
      <div className="bg-white py-4 px-8 mb-4">
        <div>
          <Mood moodRef={moods.ref} />
        </div>

        <div className="flex">
          <div className="w-1/2 p-1">
            <Todos todosRef={todos.ref} />
          </div>
          <div className="w-1/2 p-1">
            <label className="w-full mb-8 block font-semibold">
              What would you like to learn from your teammate?
              <textarea
                className="w-full border-solid border border-gray-600 h-40"
                value={answerInput}
                onChange={handleAnswerInputChange}
              />
            </label>
          </div>
        </div>

        <div className="text-red-700">
          {state.matches("ready.mood.error") && (
            <p>Please tell us how you're doing. Select a mood</p>
          )}
          {state.matches("ready.todos.error") && (
            <p>Please tell us what you're going to do today.</p>
          )}
          {state.matches("ready.answer.error") && (
            <p>
              Please answer the question. It helps connect you with the rest of
              your team.
            </p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className={`bg-button text-white uppercase px-6 py-2 rounded-sm font-body font-light block ml-auto`}
        onClick={handleSubmitClick}
      >
        Share with team
      </Button>
    </div>
  );
}

export default CheckInPage;
