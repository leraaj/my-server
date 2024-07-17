import React from "react";

const CardMessage = ({ name, message, time, type }) => {
  return (
    <li className={`${type ? "sender" : "receiver"}`}>
      <div className="name"> {type ? "" : name}</div>
      <span className="message-pill">
        <div className="message">{message}</div>
      </span>
      <div className="time">{time}</div>
    </li>
  );
};

export default CardMessage;
