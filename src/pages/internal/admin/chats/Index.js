import React, { useState, useEffect, useRef } from "react";
import "../../../../styles/chatStyles.css";
import CustomButton from "../../../../components/button/CustomButton";

const Chats = () => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="chat-layout col-12 col-lg-12">
      <div className="panel"></div>
      <div className="panel"></div>
    </div>
  );
};

export default Chats;
