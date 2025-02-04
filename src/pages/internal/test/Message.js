import React, { useState } from "react";
import dateTimeFormatter from "../../../hooks/dateTimeFormatter";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import Loader from "../../../components/loader/Loader";

const Message = ({ msg, index, popoverId, setPopoverid }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const { user, popupFunction } = useAuthContext();

  if (!msg || !msg.sender) return null;

  const isSender = (senderId) => senderId === user?._id;
  const { date, formattedTime } = dateTimeFormatter(msg.createdAt || null);
  const content = msg?.message?.[0]?.content || "";
  const type = msg?.message?.[0]?.type || ";";
  const fileType = msg?.message?.[0]?.fileType;
  const fileName = msg?.message?.[0]?.filename;

  const handleImageLoad = (fileId) => {
    setLoadingStates((prev) => ({ ...prev, [fileId]: false }));
  };

  const handleImageError = (fileId) => {
    setLoadingStates((prev) => ({ ...prev, [fileId]: false }));
  };

  return (
    <>
      <div key={index} className="message-container">
        {!isSender(msg.sender._id) && (
          <div
            className="msg-name text-secondary pb-1"
            style={{ fontSize: "0.8rem" }}>
            {msg.sender.fullName}
          </div>
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
          <span className="text-success">{fileType || "Message"}</span>
          <div className="msg-content text-break" style={{ fontSize: "1rem" }}>
            {type === "file" && fileType === "document"
              ? fileName
              : type === "text"
              ? content
              : ""}
          </div>
          <div
            className="msg-content"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              gap: "0.25rem",
            }}>
            {type === "file" &&
              fileType === "image" &&
              msg?.message?.map((file) => {
                const fileId = file?.content;
                return (
                  <>
                    {loadingStates[fileId] !== false && <Loader />}
                    <img
                      src={`https://drive.google.com/thumbnail?id=${fileId}&sz=1000`}
                      // For better clarity
                      // https://drive.google.com/thumbnail?id=${fileId}&sz=w2000&format=webp
                      className="flex-fill rounded-4"
                      style={{
                        height: "120px",
                        width: "120px",
                        objectFit: "cover",
                        cursor: "pointer",
                        display:
                          loadingStates[fileId] === false ? "block" : "none",
                      }}
                      // onClick={()=> handleImageView(fileId)}
                      onLoad={() => handleImageLoad(fileId)}
                      onError={() => handleImageError(fileId)}
                    />
                  </>
                );
              })}
          </div>
          <div
            className={`popover-container position-absolute mx-1 ${
              isSender(msg.sender._id)
                ? `bottom-0 end-100`
                : `bottom-0 start-100`
            }`}>
            <div
              className={`msg-date-time ${popupFunction(popoverId, msg._id)}`}>
              <span>{date}</span>
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
