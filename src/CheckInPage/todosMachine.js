import { Machine, spawn, assign } from "xstate";
import todoMachine from "./todoMachine";
import { uuid } from "uuidv4";

function createTodo(title) {
  return {
    id: uuid(),
    title,
    completed: false,
  };
}

const todosMachine = Machine({
  id: "todos",
  context: {
    todo: "",
    todos: [],
  },
  initial: "initializing",
  states: {
    initializing: {
      entry: assign({
        todos: (context) => {
          return context.todos.map((todo) => ({
            ...todo,
            ref: spawn(todoMachine.withContext(todo)),
          }));
        },
      }),
      on: {
        "": "all",
      },
    },
    all: {},
  },
  on: {
    "NEWTODO.CHANGE": {
      actions: assign({
        todo: (_, event) => event.value,
      }),
    },

    "NEWTODO.COMMIT": {
      cond: (_, event) => event.value.trim().length > 0,
      actions: [
        assign({
          todo: "",
          todos: (ctx, event) => {
            const newTodo = createTodo(event.value.trim());
            return ctx.todos.concat({
              ...newTodo,
              ref: spawn(todoMachine.withContext(newTodo)),
            });
          },
        }),
        "persist",
      ],
    },

    "TODO.COMMIT": {
      actions: [
        assign({
          todos: (ctx, event) => {
            return ctx.todos.map((todo) => {
              return todo.id === event.todo.id
                ? { ...todo, ...event.todo, ref: todo.ref }
                : todo;
            });
          },
        }),
        "persist",
      ],
    },

    "TODO.DELETE": {
      actions: [
        assign({
          todos: (ctx, e) => ctx.todos.filter((todo) => todo.id !== e.id),
        }),
        "persist",
      ],
    },
  },
});

export default todosMachine;
