const express = require('express')
const replyController = express.Router();
const Reply = require('../models/reply.model')
const passport = require('passport');

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


module.exports = replyController
