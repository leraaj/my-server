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
    <div key={index} className="message-container">
      <div
        id={msg._id}
        className={`${
          isSender(msg.sender._id) ? "msg-receiver" : "msg-sender"
        }`}
        onMouseEnter={() => setPopoverid(msg._id)}
        onMouseLeave={() => setPopoverid("")}>
        {!isSender(msg.sender._id) && (
          <div className="msg-name">{msg.sender.fullName}</div> // Display sender name if not the current user
        )}
        <div className="msg-content text-break">{content}</div>
        {/* Display the message content */}
        <div className="popover-container position-relative">
          <div
            className={`msg-date-time position-absolute top-50 start-0 translate-middle ${popupFunction(
              popoverId,
              msg._id
            )}`}>
            <span>{date}</span>
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
