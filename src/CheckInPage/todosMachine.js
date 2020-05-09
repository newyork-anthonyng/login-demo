import { Machine, spawn, assign } from "xstate";
import todoMachine from "./todoMachine";
import { uuid } from "uuidv4";
import { retrieve, persist } from "./storage";

function createTodo(title) {
  return {
    id: uuid(),
    title,
    completed: false,
  };
}

const todosMachine = Machine(
  {
    id: "todos",
    context: {
      outstandingTodoInput: "",
      completedTodoInput: "",
      todos: [],
    },
    initial: "initializing",
    states: {
      initializing: {
        entry: "getInitialTodos",
        on: {
          "": "ready",
        },
      },
      ready: {
        type: "parallel",
        states: {
          completedTodoInput: {
            initial: "noError",
            states: {
              noError: {},
              error: {
                initial: "empty",
                states: { empty: {} },
              },
            },
          },
          outstandingTodoInput: {
            initial: "noError",
            states: {
              noError: {},
              error: {
                initial: "empty",
                states: { empty: {} },
              },
            },
          },
        },
      },
      committingOutstandingTodo: {
        entry: ["commitOutstandingTodo", "persist"],
        on: {
          "": "ready",
        },
      },
      committingCompletedTodo: {
        entry: ["commitCompletedTodo", "persist"],
        on: {
          "": "ready",
        },
      },
    },
    on: {
      "NEW.OUTSTANDING.TODO.CHANGE": {
        actions: "cacheOutstandingTodoChange",
        target: "ready.outstandingTodoInput.noError",
      },
      "NEW.OUTSTANDING.TODO.COMMIT": [
        {
          cond: "isOutstandingTodoInputEmpty",
          target: "ready.outstandingTodoInput.error.empty",
        },
        { target: "committingOutstandingTodo" },
      ],
      "NEW.COMPLETED.TODO.CHANGE": {
        actions: "cacheCompletedTodoChange",
        target: "ready.completedTodoInput.noError",
      },
      "NEW.COMPLETED.TODO.COMMIT": [
        {
          cond: "isCompletedTodoInputEmpty",
          target: "ready.completedTodoInput.error.empty",
        },
        { target: "committingCompletedTodo" },
      ],
      "TODO.COMMIT": {
        actions: ["commitTodoChange", "persist"],
      },
      "TODO.DELETE": {
        actions: ["deleteTodo", "persist"],
      },
    },
  },
  {
    guards: {
      isOutstandingTodoInputEmpty: (context) =>
        context.outstandingTodoInput.length === 0,
      isCompletedTodoInputEmpty: (context) =>
        context.completedTodoInput.length === 0,
    },
    actions: {
      persist: (ctx) => persist(ctx.todos),
      getInitialTodos: assign({
        todos: (context) => {
          return context.todos.map((todo) => ({
            ...todo,
            ref: spawn(todoMachine.withContext(todo)),
          }));
        },
      }),
      commitTodoChange: assign({
        todos: (ctx, event) => {
          return ctx.todos.map((todo) => {
            return todo.id === event.todo.id
              ? { ...todo, ...event.todo, ref: todo.ref }
              : todo;
          });
        },
      }),
      deleteTodo: assign({
        todos: (ctx, e) => ctx.todos.filter((todo) => todo.id !== e.id),
      }),
      cacheOutstandingTodoChange: assign({
        outstandingTodoInput: (_, event) => event.value,
      }),
      cacheCompletedTodoChange: assign({
        completedTodoInput: (_, event) => event.value,
      }),
      commitOutstandingTodo: assign({
        outstandingTodoInput: "",
        todos: (context, event) => {
          const newTodo = createTodo(event.value);
          return context.todos.concat({
            ...newTodo,
            ref: spawn(todoMachine.withContext(newTodo)),
          });
        },
      }),
      commitCompletedTodo: assign({
        completedTodoInput: "",
        todos: (context, event) => {
          const newTodo = createTodo(event.value);
          newTodo.completed = true;
          return context.todos.concat({
            ...newTodo,
            ref: spawn(todoMachine.withContext(newTodo)),
          });
        },
      }),
    },
  },
  {
    outstandingTodoInput: "",
    completedTodoInput: "",
    todos: (() => {
      try {
        return retrieve() || [];
      } catch (e) {
        return [];
      }
    })(),
  }
);

export default todosMachine;
