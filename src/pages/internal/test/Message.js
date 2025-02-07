import React, { useState } from "react";
import dateTimeFormatter from "../../../hooks/dateTimeFormatter";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import Loader from "../../../components/loader/Loader";
import donwloadIcon from "../../../assets/icons/download.svg";
const Message = ({ msg, index, popoverId, setPopoverid }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const { user, popupFunction } = useAuthContext();

  if (!msg || !msg.sender) return null;

  const isSender = (senderId) => senderId === user?._id;
  const { date, formattedTime } = dateTimeFormatter(msg.createdAt || null);
  const content = msg?.message?.[0]?.content || "";
  const fileId = msg?.message?.[0]?.id || "";
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
          {/* <span className="text-success">{fileType || type}</span> */}
          <div className="msg-content text-break d-flex align-items-center flex-wrap ">
            {type === "text" ? content + "TEXT" : ""}
            <div
              className={`d-flex flex-wrap w-100 gap-2 m-0 p-0 ${
                msg?.message.some((file) => file?.fileType === "document")
                  ? "pb-2"
                  : "p-0"
              }  gy-5`}>
              {["image"].map((type) =>
                msg?.message
                  .filter((file) => file?.fileType === type)
                  .map((file) => {
                    const fileName = file?.filename;
                    const fileId = file?.content;
                    const fileType = file?.fileType || "None";

                    return (
                      <>
                        {loadingStates[fileId] !== false && <Loader />}
                        <img
                          src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`}
                          className="flex-shrink rounded-4"
                          style={{
                            height: "120px",
                            width: "120px",
                            objectFit: "cover",
                            cursor: "pointer",
                            display:
                              loadingStates[fileId] === false
                                ? "block"
                                : "none",
                          }}
                          onLoad={() => handleImageLoad(fileId)}
                          onError={() => handleImageError(fileId)}
                        />
                      </>
                    );
                  })
              )}
            </div>
            <div className="d-flex flex-wrap w-100 gap-2 m-0 p-0 gy-5">
              {["document", "music", "video"].map((type) =>
                msg?.message
                  .filter((file) => file?.fileType === type)
                  .map((file) => {
                    const fileName = file?.filename;
                    const fileId = file?.content;
                    const fileType = file?.fileType || "None";

                    switch (fileType) {
                      case "music":
                        return (
                          <div className="container flex-grow-1 border border-dark rounded-3 px-3 py-2 ">
                            <span className="d-flex justify-content-between align-items-center gap-2 mb-1 ">
                              {fileName}
                              <a
                                className="btn btn-sm btn-light rounded-pill"
                                href={`https://drive.google.com/uc?export=download&id=${fileId}`}>
                                <img
                                  src={donwloadIcon}
                                  height={15}
                                  className="text-light"
                                />
                              </a>
                            </span>
                            <iframe
                              src={`https://drive.google.com/file/d/${fileId}/preview`}
                              width="100%"
                              height="65"
                              allow="autoplay"
                              style={{ backgroundColor: "transparent" }}
                            />
                          </div>
                        );
                        break;
                      case "video":
                        return (
                          <div className="container flex-grow-1 border border-dark rounded-3 px-3 py-2 ">
                            <span className="d-flex justify-content-between align-items-center gap-2 mb-1 ">
                              {fileName}
                              <a
                                className="btn btn-sm btn-light rounded-pill"
                                href={`https://drive.google.com/uc?export=download&id=${fileId}`}>
                                <img
                                  src={donwloadIcon}
                                  height={15}
                                  className="text-light"
                                />
                              </a>
                            </span>
                            <iframe
                              src={`https://drive.google.com/file/d/${fileId}/preview`}
                              width="100%"
                              allow="autoplay"
                              style={{ backgroundColor: "transparent" }}
                            />
                          </div>
                        );
                        break;
                      case "document":
                        return (
                          <span className="row m-0 p-0 gap-2 border border-dark rounded-3 px-1 py-2">
                            <span className="d-flex justify-content-evenly align-items-center gap-2">
                              {fileName || "None"}
                              <a
                                className="btn btn-sm btn-light rounded-pill"
                                href={`https://drive.google.com/uc?export=download&id=${fileId}`}>
                                <img
                                  src={donwloadIcon}
                                  height={15}
                                  className="text-light"
                                />
                              </a>
                            </span>
                          </span>
                        );
                      default:
                        return fileType || "None";
                        break;
                    }
                  })
              )}
            </div>
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
