import React, { useEffect, useState } from "react";
import CreateIcon from "../../../assets/icons/newMessage.svg";
import dateTimeFormatter from "../../../hooks/dateTimeFormatter";
import Loader from "../../../components/loader/Loader";
import { useAuthContext } from "../../../hooks/context/useAuthContext";

const ChatList = ({
  size,
  rooms,
  loading,
  setSelectedRoom,
  selectedRoom,
  showAddCollabModal,
  // socket,
}) => {
  const { user } = useAuthContext();
  const joinRoom = (data) => {
    setSelectedRoom(data);
  };

  return (
    <>
      <div className={`chatList  ${size} ${selectedRoom}`}>
        <div className="header">
          <span className="title">Chats</span>
          <span className="action">
            {(user?.position === 1 || user?.position === 2) && (
              <button className="btn-send" onClick={showAddCollabModal}>
                <img src={CreateIcon} className="icon" />
              </button>
            )}
          </span>
        </div>
        <div className="body">
          {loading ? (
            <Loader />
          ) : (
            rooms?.map((room, index) => {
              const { date, formattedTime } = dateTimeFormatter(
                room?.latestChat?.timestamp || room?.createdAt
              );
              return (
                <div
                  key={index}
                  className={`room ${
                    selectedRoom?.title == room?.title && "room-selected"
                  }`}
                  onClick={() => joinRoom(room)}>
                  <span className="room-title">{room?.title}</span>
                  <span className="room-latest-message ">
                    {user?._id === room?.lastChat?.sender?._id
                      ? `You: ${room?.lastChat?.message[0]?.content}`
                      : `${room?.lastChat?.sender?.fullName}: ${room?.lastChat?.message[0]?.content}`}
                  </span>
                  <span className="room-latest-time">
                    {`${date} - ${formattedTime}`}
                  </span>
                </div>
              );
            })
          )}
        </div>
        <div className="footer"></div>
      </div>
    </>
  );
};

export default ChatList;
