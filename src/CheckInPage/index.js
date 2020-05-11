import React from "react";
import Todos from "./Todos";
import Mood from "./Mood/index";

function CheckInPage() {
  return (
    <div>
      <div>
        <Mood />
      </div>

      <div>
        <Todos />
      </div>
    </div>
  );
}

export default CheckInPage;
