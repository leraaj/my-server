import React, { useEffect, useRef, useState } from "react";
import SendIcon from "../../../assets/icons/send.svg";
import AttachFile from "../../../assets/icons/file-attachment.svg";
import Close from "../../../assets/icons/close.svg";
import Plus from "../../../assets/icons/plus.svg";
import Message from "./Message";
import useFetchMessages from "./useFetchMessages";
import dateTimeFormatter from "../../../hooks/dateTimeFormatter";
import { useAuthContext } from "../../../hooks/context/useAuthContext";

const SEND_MESSAGE_API = `${process.env.REACT_APP_API_URL}/api/chat`;

const ChatMessage = ({ selectedRoom, back }) => {
  const { smallScreen, user } = useAuthContext();
  const { loading, error, messages, refresh } = useFetchMessages(
    selectedRoom || {}
  );
  const [cloneMessages, setCloneMessages] = useState([]);
  const [popoverId, setPopoverid] = useState(null);
  const [limit, setLimit] = useState(10);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const handleSendMessage = async () => {
    const textMessage = {
      senderId: user?._id,
      collaboratorId: selectedRoom?._id,
      type: "text", // Make sure this matches your backend expectations
      content: message,
    };
    try {
      const response = await fetch(SEND_MESSAGE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(textMessage),
      });

      if (response.ok) {
        const data = await response.json();
        refresh();
        setMessage(""); // Reset the input field
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFilesUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
    event.target.value = ""; // Clear input field after selection
  };

  useEffect(() => {
    if (messages) {
      const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setCloneMessages(sortedMessages.slice(-limit)); // Avoid direct mutation
    }
  }, [messages, limit]);
  useEffect(() => {}, [selectedFiles]);
  const canDisplayMore = messages.length > cloneMessages.length;
  const loadMoreMessages = () => {
    if (canDisplayMore) {
      setLimit((prevLimit) => prevLimit + 5);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior (e.g., form submission)
      handleSendMessage();
    }
  };
  const handleDeleteFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="chatMessage col col-sm col-md col-lg">
      {!selectedRoom?._id ? (
        <p
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          Select a group
        </p>
      ) : (
        <>
          <div className="header">
            <div className="header gap-3">
              {smallScreen && selectedRoom?._id ? (
                <>
                  <button className="btn btn-sm btn-dark" onClick={back}>
                    Back
                  </button>
                  <span className="text-start col-12">
                    {selectedRoom?.title}
                  </span>
                </>
              ) : (
                <span className="text-start col-12">{selectedRoom?.title}</span>
              )}
            </div>
          </div>
          <div className="body">
            {canDisplayMore && (
              <button className="btn-send" onClick={loadMoreMessages}>
                Load More
              </button>
            )}
            {error && <div className="error">Error loading messages</div>}
            {cloneMessages.map((msg, index) => {
              const content = msg?.message?.[0]?.content; // Adjusted for correct access
              const { formattedTime, date, dayOfWeek, isTodayThisWeek } =
                dateTimeFormatter(msg?.createdAt);
              const today = new Date();
              const { formattedTime: todayTime, date: todayDate } =
                dateTimeFormatter(today);
              const prev = index > 0 ? cloneMessages[index - 1] : null;
              const prevMsg = prev?.createdAt || msg?.createdAt;
              const { formattedTime: prevformattedTime } =
                dateTimeFormatter(prevMsg);

              return (
                <div key={index} className="col-12">
                  {cloneMessages.length === cloneMessages.length - index && (
                    <div className="d-flex justify-content-center mb-2">
                      <span className="text-secondary">{`${selectedRoom?.title}: ${date}`}</span>
                    </div>
                  )}
                  {index === 0 || prevformattedTime !== formattedTime ? (
                    <div className="d-flex justify-content-center mb-2">
                      <span className="text-light">
                        {isTodayThisWeek
                          ? `${dayOfWeek}, ${formattedTime}`
                          : `${date}, ${formattedTime}`}
                      </span>
                    </div>
                  ) : null}
                  <Message
                    index={index}
                    msg={msg}
                    content={content}
                    popoverId={popoverId}
                    setPopoverid={setPopoverid}
                  />
                </div>
              );
            })}
          </div>
          <footer className="footer">
            <div className="forms-container row m-0 col-12">
              {selectedFiles.length > 0 && (
                <div
                  className="hstack gap-3 overflow-auto pt-3"
                  style={{ width: "100%", padding: "0.5rem" }} // Added padding for spacing
                >
                  <button
                    className="btn-secondary-send text-secondary"
                    onClick={handleFilesUploadClick}>
                    <img src={Plus} className="icon" alt="Attach File" />
                  </button>
                  {selectedFiles.map((file, index) => (
                    <span
                      key={index}
                      className="border border-secondary rounded-3 px-3 py-2 position-relative" // Added padding for better appearance
                      style={{
                        whiteSpace: "nowrap",
                        display: "inline-block", // Allow width to be respected
                      }}>
                      <button
                        className="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle"
                        style={{
                          borderRadius: "50%",
                          paddingInline: "0.5rem",
                          paddingBlock: "0.2rem",
                        }}
                        onClick={() => handleDeleteFile(index)}>
                        <img src={Close} className="icon" height={15} />
                      </button>
                      {file.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="col-12 d-flex justify-content-evenly">
                <div className="col">
                  <input
                    type="text"
                    className="form-control input-text-message"
                    placeholder="Aa"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="col-auto d-flex gap-3">
                  <button
                    className="btn-secondary-send"
                    onClick={handleFilesUploadClick}>
                    <img src={AttachFile} className="icon" alt="Attach File" />
                  </button>
                  <button className="btn-send" onClick={handleSendMessage}>
                    <img src={SendIcon} className="icon" alt="Send" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".doc,.docx,.xls,.xlsx,.pdf,.txt,.ppt,.pptx,image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default ChatMessage;
