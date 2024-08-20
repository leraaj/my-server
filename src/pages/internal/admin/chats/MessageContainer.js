import React from "react";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";

const MessageContainer = ({ msg }) => {
  // Check if the sender's name matches the current user
  const { user } = useAuthContext(); // Destructure user from useAuthContext
  const checkSender = (name) => user?.fullName === name;
  const { formattedTime, date } = dateTimeFormatter(msg?.createdAt);
  const person = checkSender(msg?.sender?.fullName);
  return (
    <div className={`${person ? "sender" : "receiver"}`}>
      <section className="message-container">
        <small>
          <span className={`${person ? "float-end" : "float-start"}`}>
            <span className="fw-bold">{!person && msg?.sender?.fullName}</span>
          </span>
        </small>
        {!person && <br />}
        <span className="fw-normal">
          {msg?.message
            ?.flatMap((m) => m.details.map((detail) => detail.content))
            .join(" ")}
        </span>
        <span className={`col-12 d-flex  justify-content-end`}>
          {`${formattedTime}  `}
        </span>
      </section>
    </div>
  );
};

export default MessageContainer;
