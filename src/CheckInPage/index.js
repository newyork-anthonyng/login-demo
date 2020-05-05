import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

function DelayedRedirect() {
  const [timeToRedirect, updateTimeToRedirect] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTimeToRedirect((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (timeToRedirect < 0) {
    return <Redirect to="/login" />;
  }

  return <div>Redirecting to login page in {timeToRedirect} seconds.</div>;
}

function CheckInPage() {
  return <DelayedRedirect />;
}

export default CheckInPage;
