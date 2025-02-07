const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter fullname"],
      unique: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    position: {
      type: Number,
      required: [true, "Please select position"],
      // 1 = admin
      // 2 = client
      // 3 = applicant
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
      },
    ],
    applicationStatus: {
      type: Number,
      required: [true, "Please select status"],
      // { value: 2, label: "Pending" },
      // { value: 3, label: "Accepted" },
      // { value: 4, label: "Rejected" },
    },
    files: {
      profile: {
        id: { type: String },
        name: { type: String },
        mimeType: { type: String },
      },
      resume: {
        id: { type: String },
        name: { type: String },
        mimeType: { type: String },
        fileType: { type: String }, // Added to categorize the file type
        filename: { type: String }, // Added filename for the resume file
        extension: { type: String }, // Added file extension
      },
      portfolio: [
        {
          id: { type: String },
          name: { type: String },
          mimeType: { type: String },
          fileType: { type: String }, // Added to categorize the file type
          filename: { type: String }, // Added filename for portfolio files
          extension: { type: String }, // Added file extension
        },
      ],
      // Portfolio can contain multiple files with similar metadata
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserModel = mongoose.model("Users", userSchema);
module.exports = UserModel;
