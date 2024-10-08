import React, { useEffect, useState } from "react";
import ChatContainer from "./ChatContainer";
import ChatConversation from "./ChatConversation";
import ChatList from "./ChatList";
import useChatLayout from "../../../../hooks/useChatLayout";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";

const Index = () => {
  const { user } = useAuthContext();
  const [chatId, setChatId] = useState(user?._id);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatGroups, setChatGroups] = useState([]);
  const Collaborators_API = `${process.env.REACT_APP_API_URL}/api/collaborators/${chatId}`;
  const { chatListSize, shouldRenderChatList, shouldRenderChatConversation } =
    useChatLayout(selectedRoom);
  useEffect(() => {
    const loadChatGroups = async () => {
      if (chatId === null) return; // Don't fetch if chatId is not set

      try {
        const response = await fetch(Collaborators_API, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setChatGroups(data); // Save data to state
        }
      } catch (error) {
        console.error("Failed to fetch chat groups:", error);
      }
    };

    loadChatGroups();
  }, [chatId, chatGroups, setChatGroups]);
  const goBack = () => {
    setSelectedRoom(null);
  };
  return (
    <ChatContainer>
      {shouldRenderChatList && (
        <ChatList
          size={chatListSize}
          list={chatGroups}
          setRoomId={setSelectedRoom}
          roomId={selectedRoom}
        />
      )}
      {shouldRenderChatConversation && (
        <ChatConversation
          roomId={selectedRoom?._id}
          roomName={selectedRoom?.title}
          back={goBack}
        />
      )}
    </ChatContainer>
  );
};

export default Index;
