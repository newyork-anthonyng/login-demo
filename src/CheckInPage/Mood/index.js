import React from "react";
import { useService } from "@xstate/react";
import Emotion from "./Emotion";

function Mood({ moodRef }) {
  const [current, send] = useService(moodRef);
  const { emotions } = current.context;

  return (
    <div>
      {emotions.map((emotion) => (
        <Emotion key={emotion.title} emotionRef={emotion.ref} />
      ))}
    </div>
  );
}

export default Mood;
