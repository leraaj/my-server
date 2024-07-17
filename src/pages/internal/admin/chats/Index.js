import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "../../../../styles/chatStyles.css";
import CustomButton from "../../../../components/button/CustomButton";
import attachIcon from "../../../../assets/icons/paperclip.svg";
import CardMessage from "../../../../components/chat/CardMessage";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import GroupChat from "../../../../components/chat/GroupChat";
import loadingIcon from "../../../../assets/icons/arrow-clockwise.svg";
import useFetch from "../../../../hooks/useFetch";
import { toast } from "sonner";
import useFetchById from "../../../../hooks/useFetchById";
import Modal from "../../../../components/modal/Modal";
import AddCollaboratorModal from "./AddCollaboratorModal";
import formatMessageDetails from "../../../../utility/formatMessageDetails";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";

const Chats = () => {
  const { user } = useAuthContext();
  const listRef = useRef(null);
  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };
  // Scroll to bottom on component mount or when dummyMessages change
  useLayoutEffect(() => {
    scrollToBottom();
  }, []);
  // Check if user is sender
  function hasName(isSender, name) {
    return isSender === name ? true : false;
  }

  const {
    data: collaborators,
    loading: loadingCollaborators,
    refresh: refreshCollaborators,
  } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/collaborators/${user?._id}`
  );

  const [collaboratorId, setCollaboratorId] = useState("");
  const [chatTitle, setChatTitle] = useState("");
  const loadChatRoom = (collab) => {
    try {
      setChatTitle(collab?.title);
      setCollaboratorId(collab?._id);
    } catch (error) {
      toast.error(error);
    }
  };

  const [addGroupModal, setAddGroupModal] = useState(null);
  const showAddGroupModal = () => {
    setAddGroupModal(true);
  };
  const hideAddGroupModal = () => {
    setAddGroupModal(null);
  };
  // Modal Details
  const [addCollaboratorModal, setAddCollaboratorModal] = useState(null);
  const showAddCollaboratorModal = () => {
    setAddCollaboratorModal(true);
  };

  const hideAddCollaboratorModal = () => {
    setAddCollaboratorModal(null);
  };
  const {
    data: conversations,
    loading: loadingConversations,
    refresh: refreshConversations,
  } = useFetchById({ path: "chats/collaborator", id: collaboratorId });
  useEffect(() => {
    refreshCollaborators();
  }, []);
  const giveTime = (input) => {
    const { formattedTime } = dateTimeFormatter(input);
    return formattedTime;
  };
  // TEXT MESSAGE
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("text");
  const sendMessage = async () => {
    try {
      const messageData = {
        senderId: user?._id,
        collaboratorId: collaboratorId,
        type: msgType,
        content: message,
      };
      alert(JSON.stringify(messageData, null, 2));
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
      <div className="chat-layout">
        <div className="panel panel-list shadow-sm">
          <div className="header shadow-sm d-flex justify-content-between">
            <span>Chats </span>
            {user?.position === 1 && (
              <div className="col-auto">
                <CustomButton
                  color="dark"
                  size="sm"
                  label="Add Group"
                  onClick={showAddCollaboratorModal}
                />
              </div>
            )}
          </div>
          <ul className="body">
            {loadingCollaborators
              ? "Loading Collaborators..."
              : collaborators && collaborators.length > 0
              ? collaborators.map((group) => {
                  return (
                    <GroupChat
                      key={group._id}
                      client={group.client?.fullName} // Assuming client field is used for client's full name
                      job={group?.title}
                      onClick={() => {
                        loadChatRoom(group);
                      }}
                    />
                  );
                })
              : "No groups yet, create one"}
          </ul>
        </div>
        <div className="panel panel-conversation shadow-sm">
          <div className="header shadow-sm">
            {chatTitle || `Select a chat room`}
          </div>
          <ul className="body list" ref={listRef}>
            {/* Place conversations here */}
            {conversations?.length > 0
              ? conversations.map((con) => {
                  return (
                    <CardMessage
                      type={hasName(user?.fullName, con?.sender?.fullName)}
                      name={con?.sender?.fullName}
                      message={formatMessageDetails(con?.message)}
                      time={giveTime(con?.createdAt)}
                    />
                  );
                })
              : "No messages"}
          </ul>
          <div className="footer">
            <div className="col">
              <input
                type="text"
                value={message || ""}
                onChange={(e) => setMessage(e.target.value)}
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
              <CustomButton
                size="sm"
                color="accent-color"
                label="Send"
                onClick={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
      <AddCollaboratorModal
        show={addCollaboratorModal}
        onHide={hideAddCollaboratorModal}
        refreshCollaborators={refreshCollaborators}
      />
    </>
  );
};

export default Chats;
