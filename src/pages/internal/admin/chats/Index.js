import React from "react";
import "../../../../styles/chatStyles.css";
const Chats = () => {
  return (
    <content className="chat-container col-12 col-lg-12">
      <section className="chat-list col-3 col-lg-3">
        <div className="chat-header">Header</div>
        <div className="chat-content">Chat Content</div>
      </section>
      <section className="chat-conversation col col-lg">
        <div className="chat-header">Header</div>
        <div className="chat-content">Chat Content</div>
      </section>
    </content>
  );
};

export default Chats;
