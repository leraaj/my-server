import React, { useState } from "react";
import CreateIcon from "../../../assets/icons/newMessage.svg";
import dateTimeFormatter from "../../../hooks/dateTimeFormatter";
import Loader from "../../../components/loader/Loader";

const ChatList = ({
  size,
  rooms,
  loading,
  setSelectedRoom,
  selectedRoom,
  showAddCollabModal,
}) => {
  return (
    <>
      <div className={`chatList  ${size}`}>
        <div className="header">
          <span className="title">Chats</span>
          <span className="action">
            <button className="btn-send" onClick={showAddCollabModal}>
              <img src={CreateIcon} className="icon" />
            </button>
          </span>
        </div>
        <div className="body">
          {loading ? (
            <Loader />
          ) : (
            rooms?.map((room, index) => {
              const { date, formattedTime } = dateTimeFormatter(
                room?.latestChat?.timestamp
              );
              return (
                <div
                  key={index}
                  className={`room ${
                    selectedRoom?.title == room?.title && "room-selected"
                  }`}
                  onClick={() => setSelectedRoom(room)}>
                  <span className="room-title">{room?.title}</span>
                  <span className="room-latest">
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
