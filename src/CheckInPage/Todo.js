import React, { useEffect, useRef } from "react";
import { useService } from "@xstate/react";

function Todo({ todoRef }) {
  const [state, send] = useService(todoRef);
  const inputRef = useRef(null);

  useEffect(() => {
    todoRef.execute(state, {
      focusInput() {
        inputRef.current && inputRef.current.select();
      },
    });
  }, [state, todoRef]);

  const { id, title, completed } = state.context;

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
  const handleDeleteClick = () => {
    send("DELETE");
  };
  if (state.matches("unknown")) {
    return <p>Loading...</p>;
  }
  return (
    <div key={id}>
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
          className={`mr-4 ${state.matches("reading") ? "block" : "hidden"} ${
            state.matches("reading.completed") ? "line-through" : ""
          }`}
          onDoubleClick={handleLabelDoubleClick}
        >
          {title}
        </label>
        <button
          onClick={handleDeleteClick}
          aria-label={`Delete todo, ${title}`}
        >
          ❌
        </button>
      </div>
    </div>
  );
}

export default Todo;
