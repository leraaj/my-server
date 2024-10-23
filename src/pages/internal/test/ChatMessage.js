import React, { useEffect, useRef, useState } from "react";
import SendIcon from "../../../assets/icons/send.svg";
import AttachFile from "../../../assets/icons/file-attachment.svg";
import Close from "../../../assets/icons/close.svg";
import Plus from "../../../assets/icons/plus.svg";
import Message from "./Message";
import dateTimeFormatter from "../../../hooks/dateTimeFormatter";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import Loader from "../../../components/loader/Loader";

const ChatMessage = ({ selectedRoom, back, socket, fetchRooms }) => {
  const { smallScreen, user, API_URL } = useAuthContext();

  const SEND_MESSAGE_API = `${API_URL}/api/chat`;
  const FETCH_MESSAGES_API = `${API_URL}/api/chats/collaborator/`;
  const [messages, setMessages] = useState([]);
  const [messagesError, setMessagesError] = useState({});
  const [messagesLoading, setMessagesLoading] = useState(false);
  const handleKeyboardTyping = (event) => {
    setMessage(event.target.value);
  };
  //
  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const response = await fetch(
        `${FETCH_MESSAGES_API}${selectedRoom?._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        setMessagesError({ error: data });
      }
    } catch (error) {
      setMessagesError({ error });
    } finally {
      setMessagesLoading(false);
    }
  };
  useEffect(() => {
    if (selectedRoom && selectedRoom?._id) {
      fetchMessages();
    }
  }, [selectedRoom?._id]);
  //

  const [cloneMessages, setCloneMessages] = useState([]);
  const [popoverId, setPopoverid] = useState(null);
  const [limit, setLimit] = useState(30);
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
        await socket.emit("send_message", {
          room: selectedRoom?._id,
          title: selectedRoom?.title,
          message: message,
        });
        fetchMessages();
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight; // Scroll to bottom on messages update
        }
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
      // Create object URLs for image files
      const filePaths = files.map((file) => ({
        file, // Store the original file object
        src: URL.createObjectURL(file), // Create object URL
      }));

      // Update selectedFiles with the new files and their corresponding object URLs
      setSelectedFiles((prevFiles) => [...filePaths, ...prevFiles]);
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
  const chatContainerRef = useRef();
  const loadMoreMessages = () => {
    if (canDisplayMore) {
      setLimit((prevLimit) => prevLimit + 5);
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 0; // Scroll to the top
      }
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
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Someone sent a message");
      fetchRooms();
      fetchMessages(); // Update messages after receiving
    });

    return () => {
      socket.off("receive_message"); // Clean up the listener when the component unmounts
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight; // Scroll to bottom on messages update
    }
  }, [cloneMessages]);

  return (
    <div className={`chatMessage col col-sm col-md col-lg ${selectedRoom}`}>
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

          {/* This line is where my overflow-auto starts */}

          <div className="body" ref={chatContainerRef}>
            {canDisplayMore && (
              <button className="btn-send" onClick={loadMoreMessages}>
                Load More
              </button>
            )}
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
                  {/* {cloneMessages.length === cloneMessages.length - index && (
                    <div className="d-flex justify-content-center mb-2">
                      <span className="text-secondary">{`${selectedRoom?.title}: ${date}`}</span>
                    </div>
                  )} */}
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
                    className="btn btn-outline-secondary btn-sm text-secondary"
                    onClick={handleFilesUploadClick}>
                    <img src={Plus} className="icon" height={15} />
                  </button>
                  {console.log(selectedFiles)}
                  {selectedFiles.map((item, index) => (
                    <span
                      key={index}
                      className={`selected-files-container border border-secondary rounded-3 ${
                        item.file.type.startsWith("image/") || "px-3 py-0"
                      }   position-relative`}>
                      <button
                        className="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle x-button"
                        onClick={() => handleDeleteFile(index)}>
                        <img src={Close} className="icon" height={15} />
                      </button>

                      {item.file.type.startsWith("image/") ? (
                        <img
                          src={item.src}
                          alt={item.file.name}
                          className="file-img rounded-3"
                        />
                      ) : (
                        <div className="file-name">{item.file.name}</div>
                      )}
                    </span>
                  ))}
                </div>
              )}

              <div className="col-12 d-flex justify-content-evenly">
                <div className="col">
                  <textarea
                    type="text"
                    className="form-control input-text-message rounded-0"
                    placeholder="Aa"
                    value={message}
                    onChange={handleKeyboardTyping}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                </div>
                <div className="col-auto d-flex gap-3">
                  <button
                    className="btn-secondary-send"
                    onClick={handleFilesUploadClick}
                    disabled={messagesLoading}>
                    <img src={AttachFile} className="icon" alt="Attach File" />
                  </button>
                  <button
                    className="btn-send"
                    onClick={handleSendMessage}
                    disabled={messagesLoading}>
                    <img src={SendIcon} className="icon" alt="Send" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".doc,.docx,.xls,.xlsx,.pdf,.txt,.ppt,.pptx,image/*,video/*"
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
