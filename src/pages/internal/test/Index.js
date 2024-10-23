import React, { useState, useEffect } from "react";
import "./test.css";
import ChatList from "./ChatList";
import ChatMessage from "./ChatMessage";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import useChatLayout from "../../../hooks/useChatLayout";
import useDimensions from "../../../hooks/useDimensions";
import AddCollabModal from "./AddCollabModal.js";
import io from "socket.io-client";

const Index = () => {
  const { user, API_URL } = useAuthContext();
  const API = `${API_URL}/api`;
  const socket = io(API_URL);

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { chatListSize, renderChatlist, renderChatconversation } =
    useChatLayout(selectedRoom);
  const [dimensions, chatContainerRef] = useDimensions();
  // SOCKET
  const dynamicJoinRoom = (data) => {
    if (data) {
      setSelectedRoom(data);
    }
  };

  // This useEffect listens for changes to selectedRoom
  useEffect(() => {
    if (selectedRoom) {
      socket.emit("join_room", selectedRoom._id); // Emit using the new room ID
    }
  }, [selectedRoom]);

  const fetchRooms = async () => {
    setRoomsLoading(true);
    if (
      user == null ||
      user == "" ||
      user == undefined ||
      (user && user.length == 0)
    ) {
      return console.log("No user: " + user);
    }
    try {
      const response = await fetch(`${API}/collaborators/${user?._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
        // data.length > 0 && dynamicJoinRoom(data[0]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchRooms();
    }
  }, [user?._id]);

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
            loading={roomsLoading}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            showAddCollabModal={showAddCollabModal}
            socket={socket}
            fetchRooms={fetchRooms}
          />
        )}
        {renderChatconversation && (
          <ChatMessage
            selectedRoom={selectedRoom}
            back={goBack}
            socket={socket}
            fetchRooms={fetchRooms}
          />
        )}
        <AddCollabModal
          show={addCollabModal}
          onHide={hideAddCollabModal}
          refresh={fetchRooms}
        />
      </div>
    </>
  );
};

export default Index;
