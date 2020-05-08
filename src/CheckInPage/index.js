import React from "react";
import { useMachine } from "@xstate/react";
import todosMachine from "./todosMachine";
import { retrieve, persist } from "./storage";
import Todo from "./Todo";

const persistedTodosMachine = todosMachine.withConfig(
  {
    actions: {
      persist: (ctx) => persist(ctx.todos),
    },
  },
  {
    todo: "",
    todos: (() => {
      try {
        return retrieve() || [];
      } catch (e) {
        return [];
      }
    })(),
  }
);

function CheckInPage() {
  const [state, send] = useMachine(persistedTodosMachine);

  const { todos, todo } = state.context;

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      send("NEWTODO.COMMIT", { value: e.target.value });
    }
  };
  const handleInputChange = (e) => {
    send("NEWTODO.CHANGE", { value: e.target.value });
  };
  return (
    <div>
      <input
        placeholder="What needs to be done?"
        autoFocus
        onKeyPress={handleInputKeyPress}
        onChange={handleInputChange}
        value={todo}
      />
      {todos.map((todo) => {
        return <Todo key={todo.id} todoRef={todo.ref} />;
      })}
    </div>
  );
}

export default CheckInPage;
