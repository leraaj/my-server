import React from "react";
import "../../../../styles/chatStyles.css";
import useDimensions from "../../../../hooks/useDimensions";

const ChatContainer = ({ children }) => {
  const [dimensions, chatContainerRef] = useDimensions();
  return (
    <div ref={chatContainerRef} id="chat-container">
      {children}
    </div>
  );
};

export default ChatContainer;
