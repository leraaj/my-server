import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import MessageContainer from "./MessageContainer";

const ChatConversation = ({ roomId, roomName, back }) => {
  const CONVERSATION_API = `${process.env.REACT_APP_API_URL}/api/chats/collaborator/${roomId}`;
  const SEND_MESSAGE_API = `${process.env.REACT_APP_API_URL}/api/chat`;
  const { smallScreen, user } = useAuthContext();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  const itemsPerPage = 10;
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [moreLoading, setMoreLoading] = useState(false);

  // Function to scroll to the bottom of the container
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  };

  // Fetch conversation messages
  const loadConversation = async () => {
    if (!roomId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(CONVERSATION_API, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setConversation(data);
        setDisplayedMessages(data.slice(-displayedCount));
      } else {
        throw new Error("Failed to fetch conversation");
      }
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
      setError("Failed to load conversation.");
    } finally {
      setLoading(false);
    }
  };

  // Load more messages incrementally
  const loadMoreConversations = () => {
    if (conversation.length <= displayedCount) return;
    const newDisplayedCount = displayedCount + itemsPerPage;
    setDisplayedCount(newDisplayedCount);
    setDisplayedMessages(conversation.slice(-newDisplayedCount));
  };

  // Reset message count when roomId changes
  useEffect(() => {
    setDisplayedCount(itemsPerPage);
    loadConversation();
  }, [roomId]);

  useEffect(() => {
    if (conversation.length > 0) {
      setMoreLoading(false);
      setDisplayedMessages(conversation.slice(-displayedCount));
    }
  }, [conversation, displayedCount]);

  const createMessage = () => {
    if (currentMessage.trim() !== "") {
      const message = {
        senderId: user?._id,
        collaboratorId: roomId,
        type: "text",
        content: currentMessage,
      };
      sendMessage(message);
    } else {
      alert("No content");
    }
  };

  const sendMessage = async (message) => {
    try {
      setMessageLoading(true);
      setMessageError(null);
      const response = await fetch(SEND_MESSAGE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(message),
      });
      if (response.ok) {
        const data = await response.json();
        loadConversation(); // Reload conversation after sending a message
        setCurrentMessage(""); // Clear message input on success
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageError("Failed to send message.");
    } finally {
      setMessageLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id="chat-conversation" className="col col-sm col-md col-lg">
      <div className="header gap-3">
        {roomId && smallScreen ? (
          <>
            <button className="btn btn-sm btn-dark" onClick={back}>
              Back
            </button>
            <span className="text-start col-12">{roomName}</span>
          </>
        ) : (
          <span className="text-start col-12">{roomName}</span>
        )}
      </div>
      {roomId && (
        <>
          <div className="body">
            <div className="vstack">
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : displayedMessages.length === 0 ? (
                <p>No messages to display.</p>
              ) : (
                <>
                  {displayedMessages.map((msg, index) => (
                    <MessageContainer key={index} msg={msg} />
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="footer btn-group">
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={handleUploadClick}>
              Upload
            </button>
            <input
              type="text"
              className="form-control rounded-0"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createMessage();
                }
              }}
            />
            <input type="file" ref={fileInputRef} className="d-none" />
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={createMessage}>
              {messageLoading ? `Loading` : `Send`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatConversation;
