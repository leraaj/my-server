// hooks/useChatLayout.js
import { useMemo } from "react";
import { useAuthContext } from "./context/useAuthContext"; // Adjust the import path as needed

const useChatLayout = (selectedGroupId) => {
  const { screenDimension, smallScreen } = useAuthContext();

  // Determine the size of the chat components based on screen dimension
  const chatListSize = useMemo(() => {
    if (screenDimension <= 600) return "col";
    if (screenDimension <= 800) return "col-5";
    if (screenDimension > 900) return "col-3";
    return "col-3";
  }, [screenDimension]);

  const renderChatlist =
    !smallScreen || !selectedGroupId || (smallScreen && !selectedGroupId);
  const renderChatconversation =
    !smallScreen || (smallScreen && selectedGroupId);

  return {
    chatListSize,
    renderChatlist,
    renderChatconversation,
  };
};

export default useChatLayout;
