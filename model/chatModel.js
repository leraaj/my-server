const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collaborator",
      required: true,
      index: false,
    },
    message: [
      {
        type: { type: String, enum: ["text", "file"], required: true }, // Message can be text or file
        content: { type: String, required: true }, // Stores text or file URL
        fileType: {
          type: String,
          enum: ["image", "document", "music", "video"],
          required: function () {
            return this.type === "file";
          }, // Required only if it's a file
        },
        filename: {
          // Required if message type is "file"
          type: String,
          required: function () {
            return this.type === "file";
          }, // Only required for file messages
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ collaborator: 1 }, { unique: false });

const ChatModel = mongoose.model("Chat", chatSchema);

module.exports = ChatModel;
