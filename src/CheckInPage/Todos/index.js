import React from "react";
import { useService } from "@xstate/react";
import Todo from "./Todo";

function Todos({ todosRef }) {
  const [state, send] = useService(todosRef);

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
      <div className="mb-8">
        <span className="font-semibold">Today's intentions:</span>
        {outstandingTodos.map((todo) => {
          return <Todo key={todo.id} todoRef={todo.ref} />;
        })}

        <div className="p-4 bg-white flex items-center">
          <input type="checkbox" value={false} className="mr-4" />
          <input
            type="text"
            value={outstandingTodoInput}
            onChange={handleOutstandingTodoChange}
            onKeyPress={handleOutstandingTodoKeyPress}
            placeholder="Tell us what you're going to do"
            className="w-full"
          />
        </div>

        {state.matches("ready.outstandingTodoInput.error.empty") && (
          <span className="text-red-700">This can't be empty!</span>
        )}
      </div>

      <div>
        <span className="font-semibold">Yesterday's wins:</span>
        {completedTodos.map((todo) => {
          return <Todo key={todo.id} todoRef={todo.ref} />;
        })}
        <div className="p-4 bg-white flex items-center">
          <input type="checkbox" value={false} className="mr-4" />
          <input
            type="text"
            value={completedTodoInput}
            onChange={handleCompletedTodoChange}
            onKeyPress={handleCompletedTodoKeyPress}
            placeholder="Tell us what you did"
            className="w-full"
          />
        </div>
        {state.matches("ready.completedTodoInput.error.empty") && (
          <span className="text-red-700">This can't be empty!</span>
        )}
      </div>
    </div>
  );
}

export default Todos;
