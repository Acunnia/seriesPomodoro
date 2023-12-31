const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    postDate: { type: Date, default: Date.now },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // @ts-ignore
  },
  { collection: "replies" }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
