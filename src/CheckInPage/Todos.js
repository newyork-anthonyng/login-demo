import React from "react";
import { useMachine } from "@xstate/react";
import todosMachine from "./todosMachine";
import Todo from "./Todo";

function Todos() {
  const [state, send] = useMachine(todosMachine);

  const { todos, outstandingTodoInput, completedTodoInput } = state.context;

  const completedTodos = todos.filter((todo) => todo.completed);
  const outstandingTodos = todos.filter((todo) => !todo.completed);

  const handleOutstandingTodoChange = (e) => {
    send("NEW.OUTSTANDING.TODO.CHANGE", { value: e.target.value });
  };

  const handleOutstandingTodoKeyPress = (e) => {
    if (e.key === "Enter") {
      send("NEW.OUTSTANDING.TODO.COMMIT", { value: e.target.value });
    }
  };

  const handleCompletedTodoChange = (e) =>
    send("NEW.COMPLETED.TODO.CHANGE", { value: e.target.value });
  const handleCompletedTodoKeyPress = (e) => {
    if (e.key === "Enter")
      send("NEW.COMPLETED.TODO.COMMIT", { value: e.target.value });
  };

  return (
    <div>
      <div>
        <span>Today's intentions:</span>
        {outstandingTodos.map((todo) => {
          return <Todo key={todo.id} todoRef={todo.ref} />;
        })}
        <input
          type="text"
          value={outstandingTodoInput}
          onChange={handleOutstandingTodoChange}
          onKeyPress={handleOutstandingTodoKeyPress}
          placeholder="Tell us what you're going to do"
        />
        {state.matches("ready.outstandingTodoInput.error.empty") && (
          <span className="text-red-700">This can't be empty!</span>
        )}
      </div>

      <div>
        <span>Yesterday's wins:</span>
        {completedTodos.map((todo) => {
          return <Todo key={todo.id} todoRef={todo.ref} />;
        })}
        <input
          type="text"
          value={completedTodoInput}
          onChange={handleCompletedTodoChange}
          onKeyPress={handleCompletedTodoKeyPress}
          placeholder="Tell us what you did"
        />
        {state.matches("ready.completedTodoInput.error.empty") && (
          <span className="text-red-700">This can't be empty!</span>
        )}
      </div>
    </div>
  );
}

export default Todos;
