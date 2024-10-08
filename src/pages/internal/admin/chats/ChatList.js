import React from "react";
import newMessageIcon from "../../../../assets/icons/newMessage.svg";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";

const ChatList = ({ size, list, setRoomId, roomId }) => {
  return (
    <div id="chat-list" className={`${size} `}>
      <div className="header">
        <span>Chat Room</span>
        <button
          type="button"
          className="btn btn-sm border border-dark d-flex justify-content-center align-items-center p-2"
          style={{
            borderRadius: "1rem",
          }}>
          <img src={newMessageIcon} style={{ height: "1rem" }} />
        </button>
      </div>
      <ul>
        {list.length === 0 ? (
          <p>No groups to display.</p>
        ) : (
          list?.map((room, index) => {
            console.log(room);
            const { date, time, formattedTime } = dateTimeFormatter(
              room?.latestChat?.timestamp
            );
            return (
              <li
                key={index}
                className={`${room?._id == roomId?._id && "active"}`}
                style={{
                  fontSize: "0.85rem",
                }}
                onClick={() => setRoomId(room)}>
                <span className="room-title">{room?.title}</span>
                <span className="room-latest">{`${date} - ${formattedTime}`}</span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default ChatList;
