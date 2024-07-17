import React from "react";

// Utility function to format message details
const formatMessageDetails = (message) => {
  return message
    .map((msg) => {
      return msg.details
        .map((detail) => {
          switch (detail.type) {
            case "message":
              return `${detail.content}`;
            case "image":
              return `${detail.content}`;
            case "url":
              return `${detail.content}`;
            default:
              return detail.content;
          }
        })
        .join(", ");
    })
    .join("; ");
};

export default formatMessageDetails;
