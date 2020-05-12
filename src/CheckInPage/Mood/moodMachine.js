import { Machine, spawn, assign, sendParent } from "xstate";
import emotionMachine from "./emotionMachine";

const machine = Machine(
  {
    id: "mood",
    context: {
      emotions: [],
    },
    initial: "loading",
    states: {
      loading: {
        entry: "load",
      },
    },

    on: {
      SELECT: {
        actions: ["deselectOthers", "notifyParent"],
      },
    },
  },
  {
    actions: {
      load: assign((context) => {
        return {
          emotions: context.emotions.map((emotion) => {
            const ref = spawn(emotionMachine.withContext(emotion));
            return {
              ...emotion,
              ref,
            };
          }),
        };
      }),

      deselectOthers: (context, event) => {
        context.emotions.forEach((emotion) => {
          const { title } = emotion;

          if (title !== event.value) {
            emotion.ref.send("DESELECT");
          }
        });
      },

      notifyParent: sendParent((_, event) => {
        return { type: "PARENT.MOOD_COMMIT", value: event.value };
      }),
    },
  }
);

export default machine;
