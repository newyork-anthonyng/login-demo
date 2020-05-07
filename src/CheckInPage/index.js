import React, { useEffect, useRef } from "react";
import { Machine, interpret, assign } from "xstate";
import { useMachine } from "@xstate/react";

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
      actions: assign({ completed: true }),
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
              actions: [assign({ completed: true })],
            },
          },
        },
        completed: {
          on: {
            TOGGLE_COMPLETE: {
              target: "pending",
              actions: [assign({ completed: false })],
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
          actions: assign({
            title: (_, event) => event.value,
          }),
        },
        COMMIT: [
          {
            cond: (ctx) => ctx.title.trim().length > 0,
            actions: [],
            // What does this do?
            target: "reading.hist",
          },
          { target: "deleted" },
        ],
        BLUR: {
          target: "reading",
          actions: [],
        },
        CANCEL: {
          target: "reading",
          actions: assign({ title: (ctx) => ctx.prevTitle }),
        },
      },
    },
    deleted: {
      onEntry: [],
    },
  },
});

function CheckInPage() {
  const inputRef = useRef(null);

  const [state, send] = useMachine(todoMachine);
  const service = interpret(todoMachine);
  useEffect(() => {
    // need to do "current.select" inside useEffect. Otherwise, input field isn't visible yet
    service.execute(state, {
      focusInput() {
        inputRef.current && inputRef.current.select();
      },
    });
  }, [state]);
  const { title, completed } = state.context;

  const handleTextChange = (e) => {
    send("CHANGE", { value: e.target.value });
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      send("COMMIT");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      send("CANCEL");
    }
  };
  const handleLabelDoubleClick = () => {
    send("EDIT");
  };
  const handleBlur = () => {
    send("BLUR");
  };
  const handleCheckboxChange = () => {
    send("TOGGLE_COMPLETE");
  };

  if (state.matches("unknown")) {
    return <p>Loading...</p>;
  }
  console.log("completed:", completed);
  return (
    <div>
      <h1>
        Status:{" "}
        {state.matches("reading.pending")
          ? "Pending"
          : state.matches("reading.completed") && "Completed"}
      </h1>
      <div className="flex items-center">
        <input
          type="checkbox"
          onChange={handleCheckboxChange}
          value={completed}
          checked={completed}
        />
        <input
          className={state.matches("editing") ? "block" : "hidden"}
          type="text"
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          value={title}
          ref={inputRef}
        />
        <label
          className={`${state.matches("reading") ? "block" : "hidden"} ${
            state.matches("reading.completed") ? "line-through" : ""
          }`}
          onDoubleClick={handleLabelDoubleClick}
        >
          {title}
        </label>
      </div>
    </div>
  );
}

export default CheckInPage;
