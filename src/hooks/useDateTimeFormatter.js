import React from "react";

const useDateTimeFormatter = (timestamp) => {
  const dateObj = new Date(timestamp);
  const date = dateObj.toISOString().split("T")[0]; // Extracts date
  const time = dateObj.toISOString().split("T")[1].split("Z")[0]; // Extracts time
  const options = { hour: "2-digit", minute: "2-digit" };
  const formattedTime = dateObj.toLocaleTimeString([], options); // Format time

  return { date, time, formattedTime };
};

export default useDateTimeFormatter;
