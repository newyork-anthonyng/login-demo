import React from "react";
import { Machine, assign, spawn, sendParent } from "xstate";
import { useMachine } from "@xstate/react";
import Emotion from "./Emotion";

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

const machine = Machine(
  {
    id: "mood",
    context: {
      emotions: [
        { selected: false, title: "😇" },
        { selected: false, title: "😀" },
        { selected: false, title: "😅" },
      ],
      emotionsRefs: [],
    },
    initial: "loading",
    states: {
      loading: {
        entry: "load",
      },
    },

    on: {
      SELECT: {
        actions: ["deselectOthers"],
      },
    },
  },
  {
    actions: {
      load: assign((context) => {
        return {
          emotionsRefs: context.emotions.map((emotion) =>
            spawn(emotionMachine.withContext(emotion), { sync: true })
          ),
        };
      }),

      deselectOthers: (context, event) => {
        context.emotionsRefs.forEach((emotion) => {
          const { title } = emotion.state.context;

          if (title !== event.value) {
            emotion.send("DESELECT");
          }
        });
      },
    },
  }
);

function Mood() {
  const [current, send] = useMachine(machine);
  const { emotionsRefs } = current.context;

  return (
    <div>
      {emotionsRefs.map((emotion) => (
        <Emotion key={emotion.state.context.title} emotionRef={emotion} />
      ))}
    </div>
  );
}

export default Mood;
