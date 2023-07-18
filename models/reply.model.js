const mongoose = require('mongoose');
const shortid = require("shortid");

const replySchema = new mongoose.Schema({
    message: {      type: String,       required: true},
    autor: {        type:mongoose.Schema.Types.ObjectId,    ref: 'User'},
    topic: [{       type: mongoose.Schema.Types.ObjectId,   ref: 'Topic'}],
    likedBy: [{     type: mongoose.Schema.Types.ObjectId,   ref: "User"}]
}, { collection: 'replies' });

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
