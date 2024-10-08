import React from "react";

const dateTimeFormatter = (timestamp) => {
  if (timestamp === null || isNaN(new Date(timestamp).getTime())) {
    return {
      date: "",
      time: "",
      formattedTime: "",
      dayOfWeek: "",
      isTodayThisWeek: false,
    }; // Return empty strings for invalid timestamp
  }

  const dateObj = new Date(timestamp);
  const today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const date = dateObj.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
  const time = dateObj.toISOString().split("T")[1].split("Z")[0]; // Extracts time
  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Format time
  const dayOfWeek = dateObj.toLocaleString("en-US", { weekday: "short" }); // Get day of the week

  // Check if the date is today or this week
  const isTodayThisWeek =
    dateObj.toDateString() === today.toDateString() ||
    (dateObj >= new Date(today.setDate(today.getDate() - today.getDay())) &&
      dateObj <=
        new Date(today.setDate(today.getDate() + (6 - today.getDay()))));

  return { date, time, formattedTime, dayOfWeek, isTodayThisWeek };
};

export default dateTimeFormatter;
