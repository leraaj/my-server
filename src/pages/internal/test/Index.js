import React, { useState, useEffect } from "react";
import "./test.css";
import ChatList from "./ChatList";
import ChatMessage from "./ChatMessage";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import useChatLayout from "../../../hooks/useChatLayout";
import useDimensions from "../../../hooks/useDimensions";
import AddCollabModal from "./AddCollabModal.js";
// SOCKET.IO
import io from "socket.io-client";
const socket = io.connect(`${process.env.REACT_APP_API_URL}`); // Connect to socket server
const API = `${process.env.REACT_APP_API_URL}/api`;

const Index = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { chatListSize, renderChatlist, renderChatconversation } =
    useChatLayout(selectedRoom);
  const [dimensions, chatContainerRef] = useDimensions();

  // Listen for socket connection
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Client socket connected with ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("Client socket disconnected.");
    });

    return () => {
      socket.off("connect"); // Clean up on component unmount
      socket.off("disconnect");
    };
  }, []);

  // SOCKET
  const dynamicJoinRoom = (data) => {
    if (selectedRoom !== "" || selectedRoom !== null || data !== null) {
      setSelectedRoom(data);
      socket.emit("join_room", selectedRoom);
    }
  };

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
        data.length > 0 && dynamicJoinRoom(data[0]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      // Ensure user exists and has an ID
      fetchRooms();
    }
  }, [user?._id]); // Depend only on user ID

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
          />
        )}
        {renderChatconversation && (
          <ChatMessage
            selectedRoom={selectedRoom}
            back={goBack}
            socket={socket}
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
