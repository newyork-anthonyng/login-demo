import { Machine, assign, sendParent } from "xstate";

const emotionMachine = Machine(
  {
    id: "emotion",
    context: {
      selected: false,
      title: "",
    },
    initial: "ready",
    states: {
      ready: {},
    },
    on: {
      TOGGLE: {
        actions: ["toggle", "select"],
      },
      DESELECT: {
        actions: ["deselect"],
      },
    },
  },
  {
    actions: {
      toggle: assign((context) => {
        return {
          selected: !context.selected,
        };
      }),
      select: sendParent((context) => ({
        type: "SELECT",
        value: context.title,
      })),
      deselect: assign({
        selected: false,
      }),
    },
  }
);

export default emotionMachine;
