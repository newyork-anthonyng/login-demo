import React from "react";
import { useService } from "@xstate/react";
import Emotion from "./Emotion";

function Mood({ moodRef }) {
  const [current, send] = useService(moodRef);
  const { emotions } = current.context;

  return (
    <div className="flex">
      <div>
        <p>Good morning, Anthony!</p>
        <p>It's April 23, 2020. How are you feeling today?</p>
      </div>

      <div className="flex">
        {emotions.map((emotion) => (
          <Emotion key={emotion.title} emotionRef={emotion.ref} />
        ))}
      </div>
    </div>
  );
}

export default Mood;
