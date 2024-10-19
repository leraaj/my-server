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
  const roomId = selectedGroupId?._id;
  const chatListLG = !roomId || screenDimension >= 900;
  const chatListMD = !roomId || screenDimension > 800;
  const chatListSM = !roomId || screenDimension > 600;
  const renderChatlist = chatListLG || chatListMD || chatListSM;
  // !smallScreen || !selectedGroupId || (smallScreen && !selectedGroupId);
  const chatConvoXL = (roomId || !roomId) && screenDimension >= 900;
  const chatConvoLG = (roomId || !roomId) && screenDimension > 800;
  const chatConvoMD = (roomId || !roomId) && screenDimension > 600;
  const chatConvSM = roomId && smallScreen;
  const renderChatconversation =
    chatConvoXL || chatConvoLG || chatConvoMD || chatConvSM;
  // !smallScreen || (smallScreen && !selectedGroupId);

  return {
    chatListSize,
    renderChatlist,
    renderChatconversation,
  };
};

export default useChatLayout;
