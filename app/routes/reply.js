const express = require("express");
const replyController = express.Router();
const Reply = require("../models/reply.model");
const passport = require("passport");
const Topic = require("../models/topic.model");
const User = require("../models/user.model");

replyController.post(
  "/like",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const postID = req.body.id;
      const userID = req.user.id;

      const reply = await Reply.findById(postID);

      if (!reply) {
        return res.status(404).json({ message: "Reply not found " + postID });
      }

      const likedIndex = reply.likedBy.indexOf(userID);

      if (likedIndex === -1) {
        reply.likedBy.push(userID);
      } else {
        reply.likedBy.splice(likedIndex, 1);
      }

      await reply.save();

      return res.status(200).json({ message: "Like updated successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  }
);

replyController.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { message, topicId, author } = req.body;
    const userId = req.user.id;

    try {
      let foundTopic = await Topic.findById(topicId);

      if (!foundTopic) {
        return res.status(404).json({ error: "Topic not found" });
      }

      const newReply = new Reply({
        message: message,
        author: userId,
        topic: topicId,
      });

      const savedReply = await newReply.save();

      // Find the topic and update its replies field
      foundTopic.replies.push(savedReply._id);
      await foundTopic.save();

      // Find the user and update their replies field
      const user = await User.findById(userId);
      user.replies.push(savedReply._id);
      await user.save();

      const populatedReply = await Reply.findById(savedReply._id, "author")
        .lean()
        .populate({ path: "author", select: "-password" });

      const count = await Reply.countDocuments({ topic: topicId });

      // Convert the reply to JSON
      const resReply = savedReply.toObject();
      resReply.author = populatedReply.author;

      res
        .status(201)
        .json({ resReply, topicTotalPages: Math.ceil(count / 10) });
    } catch (error) {
      console.error("Error trying to post the reply:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

replyController.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const replyID = req.params.id;
    const { userId, admin_level } = req.user;

    const findedReply = await Reply.findById(replyID).exec();

    if (findedReply.author._id == userId || admin_level > 3) {
      findedReply.isDeleted = true;
      findedReply.save();
      return res.status(200).json({ msg: "Reply have been deleted" });
    } else {
      return res.status(301);
    }
  }
);

module.exports = replyController;
