const express = require('express');

const statsController = express.Router();
const Reply = require('../models/reply.model');
const Topic = require('../models/topic.model');
const User = require('../models/user.model');

statsController.get('/activity', async (req, res) => {
    try {
        let result = [];
    
        const replies = await Reply.find()
            .populate({
            path: 'author',
            select: '-replies -topics',
            populate: {
                path: 'role',
            },
            })
            .populate({
                path: 'topic',
                select: '-replies',
            })
            .lean()
            .sort({ createdAt: -1 })
            .limit(5);
  
        replies.forEach(reply => {
            reply.type = 'reply';
        });
    
        result = [...result, ...replies];
    
        const topics = await Topic.find({}, '-replies')
            .lean()
            .populate({
            path: 'category author',
            select: '-topics -description -replies',
            })
            .sort({ createdAt: -1 })
            .limit(5);
    
        topics.forEach(topic => {
            // @ts-ignore
            topic.type = 'topic';
        });
    
        result = [...result, ...topics];
    
        const users = await User.find({}, '-replies -topics')
            .lean()
            .sort({ registerDate: -1 })
            .limit(5);
    
        users.forEach(user => {
            // @ts-ignore
            user.type = 'user';
            // @ts-ignore
            user.createdAt = user.registerDate;
        });
    
        result = [...result, ...users];
    
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
    
        res.status(200).json({ activities: result });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las actividades' });
        }
  });

module.exports = statsController;