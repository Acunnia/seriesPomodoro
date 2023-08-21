const express = require('express')
const replyController = express.Router();
const Reply = require('../models/reply.model')
const passport = require('passport');
const Topic = require("../models/topic.model");

replyController.post('/like', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const postID = req.body.id;
        const userID = req.user.id;

        const reply = await Reply.findById(postID);

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found ' + postID });
        }

        const likedIndex = reply.likedBy.indexOf(userID);

        if (likedIndex === -1) {
            reply.likedBy.push(userID);
        } else {
            reply.likedBy.splice(likedIndex, 1);
        }

        await reply.save();

        return res.status(200).json({ message: 'Like updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

replyController.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { message, topicId, author } = req.body;
    const userId = req.user.id;

    let foundTopic;

    Topic.findById(topicId)
        .then((topic) => {
            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            foundTopic = topic;

            const newReply = new Reply({
                message: message,
                author: userId,
                topic: topicId,
            });

            return newReply.save();
        })
        .then((savedReply) => {
            foundTopic.replies.push(savedReply._id);
            return foundTopic.save();
        })
        .then(() => {
            res.status(201).json({ message: 'Reply added' });
        })
        .catch((error) => {
            console.error('Error trying to post the reply:', error);
            res.status(500).json({ error: 'Something went wrong' });
        });
})


module.exports = replyController
