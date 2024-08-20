import React from "react";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";

const ChatList = ({ size, list, setCollaboratorId, collaboratorId }) => {
  return (
    <div id="chat-list" className={`${size} `}>
      <ul>
        {list.length === 0 ? (
          <p>No groups to display.</p>
        ) : (
          list?.map((group, index) => {
            return (
              <li
                key={index}
                className={`${
                  group?._id == collaboratorId
                    ? "border border-danger"
                    : "border"
                }`}>
                <a
                  onClick={() => setCollaboratorId(group?._id)}
                  className="text-decoration-none text-nowrap">
                  {`${group?.title}`}
                </a>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default ChatList;
