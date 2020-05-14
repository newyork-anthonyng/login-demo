import React from "react";
import { useService } from "@xstate/react";

function Emotion({ emotionRef }) {
  const [current, send] = useService(emotionRef);
  const { title, selected } = current.context;

  const handleClick = () => send("TOGGLE");

  return (
    <div
      onClick={handleClick}
      className={`${
        selected ? "border-blue-600" : "border-transparent"
      } border-4 rounded cursor-pointer text-5xl p-6`}
    >
      {title}
    </div>
  );
}

export default Emotion;
