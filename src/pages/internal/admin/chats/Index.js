import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import "../../../../styles/chatStyles.css";
import CustomButton from "../../../../components/button/CustomButton";
import attachIcon from "../../../../assets/icons/paperclip.svg";
import CardMessage from "../../../../components/chat/CardMessage";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import GroupChat from "../../../../components/chat/GroupChat";
import dummyMessages from "./message.json";
import loadingIcon from "../../../../assets/icons/arrow-clockwise.svg";

const Chats = () => {
  const { user } = useAuthContext();
  const scrollContainer = useRef(null);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const scrollToBottom = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
    }
  };
  useEffect(() => {
    setVisibleMessages(dummyMessages.slice(-messageCount));
  }, []);
  scrollToBottom();
  function hasName(type, name) {
    return type === 1 ? "" : name;
  }
  const lastMessageReached = messageCount >= dummyMessages.length;

  return (
    <div className="chat-layout">
      <div className="panel panel-list shadow-sm">
        <div className="header shadow-sm">Collaborators</div>
        <ul className="body">
          <GroupChat client="April Esta" job="Graphic Designers" />
        </ul>
      </div>
      <div className="panel panel-conversation shadow-sm">
        <div className="header shadow-sm">Graphic Designers</div>
        <ul className="body list">
          <li className="top-list">
            {/* Conditional rendering for the "Load more" button */}
            {loading ? (
              <span className="top-list-message">Loading...</span>
            ) : lastMessageReached ? (
              <span className="top-list-message">
                You've reached the top of the conversation
              </span>
            ) : (
              <button className="btn btn-sm btn-light top-list-message rounded-pill p-2">
                <img src={loadingIcon} height={20} />
              </button>
            )}
          </li>
          {visibleMessages.map((message, index) => (
            <CardMessage
              key={index}
              type={message.type}
              message={message.message}
              time={message.time}
              name={hasName(message.type, message.name)}
            />
          ))}
          {/* Empty li element to ensure scroll to bottom */}
        </ul>
        <div className="footer">
          <div className="col">
            <input
              type="text"
              className="form-control form-control-light"
              placeholder="Aa"
            />
          </div>
          <div className="col-auto d-flex gap-1">
            <CustomButton
              size="sm"
              color="outline-light"
              label={<img src={attachIcon} className="attach-file-icon" />}
            />
            <CustomButton size="sm" color="accent-color" label="Send" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
