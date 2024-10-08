import React, { useState, useEffect } from "react";
import "./test.css";
import ChatList from "./ChatList";
import ChatMessage from "./ChatMessage";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import useChatLayout from "../../../hooks/useChatLayout";
import useDimensions from "../../../hooks/useDimensions";
import AddCollabModal from "./AddCollabModal.js";
const API = `${process.env.REACT_APP_API_URL}/api`;

const Index = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { chatListSize, renderChatlist, renderChatconversation } =
    useChatLayout(selectedRoom);
  const [dimensions, chatContainerRef] = useDimensions();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/collaborators/${user._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
        data.length > 0 && setSelectedRoom(data[0]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []); // No dependencies

  const goBack = () => {
    setSelectedRoom(null);
  };
  // ADD MODAL VARIABLES
  const [addCollabModal, setAddCollabModal] = useState(null);
  const showAddCollabModal = () => {
    setAddCollabModal(true);
  };
  const hideAddCollabModal = () => {
    setAddCollabModal(false);
  };
  return (
    <>
      <div ref={chatContainerRef} id="chatContainer">
        {renderChatlist && (
          <ChatList
            size={chatListSize}
            rooms={rooms}
            loading={loading}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            showAddCollabModal={showAddCollabModal}
          />
        )}
        {renderChatconversation && (
          <ChatMessage selectedRoom={selectedRoom} back={goBack} />
        )}
        <AddCollabModal
          show={addCollabModal}
          onHide={hideAddCollabModal}
          refresh={null}
        />
      </div>
    </>
  );
};

export default Index;
