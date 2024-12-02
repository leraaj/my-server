import React from "react";
import dateTimeFormatter from "../../../hooks/dateTimeFormatter";
import { useAuthContext } from "../../../hooks/context/useAuthContext";

const Message = ({ msg, index, popoverId, setPopoverid }) => {
  const { user, popupFunction } = useAuthContext();

  // Safely check if the message object and its properties exist
  if (!msg || !msg.sender) return null; // Return null if msg or msg.sender is undefined

  const isSender = (senderId) => senderId === user?._id; // Check based on user ID
  const { date, formattedTime } = dateTimeFormatter(msg.createdAt || null);
  const content = msg?.message?.[0]?.content || ""; // Default to empty string if content is undefined

  return (
    <div key={index} className="message-container  ">
      {!isSender(msg.sender._id) && (
        <div
          className="msg-name text-secondary pb-1"
          style={{ fontSize: "0.8rem" }}>
          {msg.sender.fullName}
        </div> // Display sender name if not the current user
      )}
      <div
        id={msg._id}
        className={`${
          isSender(msg.sender._id) ? "msg-receiver" : "msg-sender"
        } position-relative`}
        style={{
          backgroundColor:
            !isSender(msg.sender._id) && msg.sender.position === 1
              ? "#85F6B8"
              : !isSender(msg.sender._id) && msg.sender.position === 2
              ? "#85E5F6"
              : !isSender(msg.sender._id) && msg.sender.position === 3
              ? "#B785F6"
              : "",
        }}
        onMouseEnter={() => setPopoverid(msg._id)}
        onMouseLeave={() => setPopoverid("")}>
        <div className="msg-content text-break" style={{ fontSize: "1rem" }}>
          {content}
        </div>
        <div
          className={`popover-container position-absolute mx-1 ${
            isSender(msg.sender._id)
              ? `bottom-0 end-100 `
              : `bottom-0 start-100 `
          }`}>
          <div
            className={`msg-date-time 
          
            ${popupFunction(popoverId, msg._id)}`}>
            <span>{date}</span>
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
