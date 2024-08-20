import React, { useEffect, useState, useRef } from "react";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import MessageContainer from "./MessageContainer";

const ChatConversation = ({ collaboratorId, back }) => {
  // ================== VARIABLES ================== //
  const { smallScreen, user } = useAuthContext();
  const [message, setMessage] = useState({});
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Ref to the file input element
  const CONVERSATION_API = `${process.env.REACT_APP_API_URL}/api/chats/collaborator/${collaboratorId}`;
  const SEND_MESSAGE_API = `${process.env.REACT_APP_API_URL}/api/chat`;
  // ================== FETCH FUNCTIONS ================== //
  // => FETCH CONVERSATION
  const loadConversation = async () => {
    if (!collaboratorId || collaboratorId === "") return; // Don't fetch if collaboratorId is not set
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
        setConversation(data); // Save data to state
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
  useEffect(() => {
    loadConversation();
  }, [collaboratorId]);
  // => FETCH CONVERSATION
  // => POST MESSAGE
  const resetMessageDetails = () => {
    setMessage({});
  };
  const sendMessage = async () => {
    try {
      const response = await fetch(SEND_MESSAGE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(message),
      });
      if (response.ok) {
        const data = await response.json();
        loadConversation();
        resetMessageDetails();
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
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div id="chat-conversation" className="col col-sm col-md col-lg">
      <header>
        {collaboratorId && smallScreen && (
          <button className="btn btn-sm btn-dark" onClick={back}>
            Back
          </button>
        )}
      </header>
      <section className="overflow-auto">
        <div className="vstack">
          {!collaboratorId ? (
            "Select a group first"
          ) : conversation.length === 0 ? (
            <p>No messages to display.</p>
          ) : (
            conversation.map((msg, index) => (
              <MessageContainer key={index} msg={msg} />
            ))
          )}
        </div>
      </section>
      <footer className="btn-group">
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={handleUploadClick} // Trigger file input click
        >
          Upload
        </button>
        <textarea
          className="form-control rounded-0"
          rows="2"
          defaultValue={""}
          onChange={(e) =>
            setMessage({
              senderId: user?._id,
              collaboratorId: collaboratorId,
              type: "text",
              content: e.target.value,
            })
          }
        />
        <input
          type="file"
          ref={fileInputRef}
          className="d-none" // Hide the file input
        />
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={sendMessage}>
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatConversation;
