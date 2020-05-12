import { Machine, assign, sendParent } from "xstate";

const todoMachine = Machine({
  id: "todo",
  initial: "reading",
  context: {
    id: undefined,
    title: "walk dog",
    prevTitle: "",
    completed: false,
  },
  on: {
    TOGGLE_COMPLETE: {
      target: ".reading.completed",
      actions: [
        assign({ completed: true }),
        sendParent((ctx) => ({ type: "TODO.COMMIT", todo: ctx })),
      ],
    },
    DELETE: "deleted",
  },
  states: {
    reading: {
      initial: "unknown",
      states: {
        unknown: {
          on: {
            "": [
              { target: "completed", cond: (ctx) => ctx.completed },
              { target: "pending" },
            ],
          },
        },
        pending: {
          on: {
            SET_COMPLETED: {
              target: "completed",
              actions: [
                assign({ completed: true }),
                sendParent((ctx) => ({ type: "TODO.COMMIT", todo: ctx })),
              ],
            },
          },
        },
        completed: {
          on: {
            TOGGLE_COMPLETE: {
              target: "pending",
              actions: [
                assign({ completed: false }),
                sendParent((ctx) => ({ type: "TODO.COMMIT", todo: ctx })),
              ],
            },
          },
        },
        hist: { type: "history" },
      },
      on: {
        EDIT: {
          target: "editing",
          actions: "focusInput",
        },
      },
    },
    editing: {
      onEntry: assign({ prevTitle: (ctx) => ctx.title }),
      on: {
        CHANGE: {
          actions: [
            assign({
              title: (_, event) => event.value,
            }),
          ],
        },
        COMMIT: [
          {
            cond: (ctx) => ctx.title.trim().length > 0,
            actions: [
              sendParent((ctx) => ({ type: "TODO.COMMIT", todo: ctx })),
            ],
            target: "reading.hist",
          },
          { target: "deleted" },
        ],
        BLUR: {
          target: "reading",
          actions: [sendParent((ctx) => ({ type: "TODO.COMMIT", todo: ctx }))],
        },
        CANCEL: {
          target: "reading",
          actions: assign({ title: (ctx) => ctx.prevTitle }),
        },
      },
    },
    deleted: {
      onEntry: sendParent((ctx) => ({ type: "TODO.DELETE", id: ctx.id })),
    },
  },
});

export default todoMachine;
