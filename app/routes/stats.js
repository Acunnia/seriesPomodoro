const express = require('express');

const statsController = express.Router();
const Reply = require('../models/reply.model');
const Topic = require('../models/topic.model');
const User = require('../models/user.model');

const TypeEnum = {
    REPLY: "reply",
    USER: "user",
    TOPIC: "topic"
}

async function getRecentActivities() {
    try {
        const [replies, topics, users] = await Promise.all([
            Reply.find().populate({
                path: 'author',
                select: '-replies -topics',
                populate: {
                    path: 'role',
                },
            }).populate({
                path: 'topic',
                select: '-replies',
            }).lean().sort({ createdAt: -1 }).limit(5),
            Topic.find({}, '-replies').lean().populate({
                path: 'category author',
                select: '-topics -description -replies',
            }).sort({ createdAt: -1 }).limit(5),
            User.find({}, '-replies -topics').lean().sort({ registerDate: -1 }).limit(5),
        ]);

        replies.forEach(reply => {
            reply.type = TypeEnum.REPLY;
        });

        topics.forEach(topic => {
            topic.type = TypeEnum.TOPIC;
        });

        users.forEach(user => {
            user.type = TypeEnum.USER;
            user.createdAt = user.registerDate;
        });

        const result = [...replies, ...topics, ...users];

        result.sort((a, b) => {
            const aDate = new Date(a.createdAt);
            const bDate = new Date(b.createdAt);

            if (aDate.getTime() > bDate.getTime()) {
                return -1;
            } else if (aDate.getTime() < bDate.getTime()) {
                return 1;
            }

            return 0;
        });

        return result;
    } catch (error) {
        throw error;
    }
}

statsController.get('/activity', async (req, res) => {
    try {
        const activities = await getRecentActivities();
        res.status(200).json({ activities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las actividades' });
    }
});

module.exports = statsController;