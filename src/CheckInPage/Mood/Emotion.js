import React from "react";
import { useService } from "@xstate/react";

function Emotion({ emotionRef }) {
  const [current, send] = useService(emotionRef);
  const { title, selected } = current.context;

  const handleClick = () => send("TOGGLE");

  return (
    <div
      onClick={handleClick}
      className={`${selected ? "border-2 border-blue-600" : ""} cursor-pointer`}
    >
      {title}
    </div>
  );
}

export default Emotion;
