import React from "react";
const GroupChat = ({ job, client }) => {
  return (
    <li className="group-chat-container">
      <span className="group-chat-job">{job}</span>
      <span className="group-chat-client">{client}</span>
    </li>
  );
};

export default GroupChat;
