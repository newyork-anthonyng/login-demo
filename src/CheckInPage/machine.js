import { Machine, spawn, assign } from "xstate";
import todosMachine from "./Todos/todosMachine";
import moodMachine from "./Mood/moodMachine";
import { retrieve } from "./storage";

const machine = Machine(
  {
    id: "check-in",
    context: {
      moods: {
        emotions: [],
      },
      todos: {
        todos: [],
      },
    },
    initial: "loading",
    states: {
      loading: {
        entry: "loading",
        on: {
          "": "ready",
        },
      },
      ready: {
        type: "parallel",
        on: {
          SUBMIT: [
            {
              cond: "isMoodEmpty",
              target: "ready.mood.error",
            },
            {
              cond: "areTodosEmpty",
              target: "ready.todos.error",
            },
            {
              target: "submitting",
            },
          ],
        },

        states: {
          mood: {
            initial: "noError",
            states: {
              noError: {},
              error: {},
            },
          },

          todos: {
            initial: "noError",
            states: {
              noError: {},
              error: {},
            },
          },
        },
      },
      submitting: {
        invoke: {
          src: "submitCheckIn",
          onDone: "success",
        },
      },
      success: {},
    },
    on: {
      "PARENT.MOOD_COMMIT": {
        actions: "commitMood",
        target: ["ready.mood.noError"],
      },
      "PARENT.TODO_COMMIT": {
        actions: "commitTodo",
        target: ["ready.todos.noError"],
      },
    },
  },
  {
    guards: {
      isMoodEmpty: (context) => {
        const result = context.moods.emotions.some((emotion) => {
          return emotion.selected;
        });

        return !result;
      },
      areTodosEmpty: (context) => {
        const result = context.todos.todos.some((todo) => !todo.completed);

        return !result;
      },
    },
    services: {
      submitCheckIn: (context, event) => {
        // TODO: Submit context information to backend
        console.log(context);
        return Promise.resolve({});
      },
    },
    actions: {
      loading: assign((context) => {
        return {
          moods: {
            ...context.moods,
            ref: spawn(moodMachine.withContext(context.moods)),
          },
          todos: {
            ...context.todos,
            ref: spawn(todosMachine.withContext(context.todos)),
          },
        };
      }),
      commitMood: assign((context, event) => {
        return {
          moods: {
            ...context.moods,
            emotions: context.moods.emotions.map((emotion) => {
              if (emotion.title === event.value) {
                return {
                  ...emotion,
                  selected: !emotion.selected,
                };
              } else {
                return {
                  ...emotion,
                  selected: false,
                };
              }
            }),
          },
        };
      }),
      commitTodo: assign((context, event) => {
        return {
          todos: {
            ...context.todos,
            todos: event.todos,
          },
        };
      }),
    },
  },
  {
    todos: {
      todos: (() => {
        try {
          return retrieve() || [];
        } catch (e) {
          return [];
        }
      })(),
    },
    moods: {
      emotions: [
        { selected: false, title: "💩" },
        { selected: false, title: "😀" },
        { selected: false, title: "😅" },
      ],
    },
  }
);

export default machine;
