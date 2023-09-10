const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    title: {        type: String,       required: true},
    description: {  type: String},
    category: {     type: mongoose.Schema.Types.ObjectId,   ref: 'Subcategory'},
    author: {       type: mongoose.Schema.Types.ObjectId,   ref: 'User'},
    lastreply: {    type: mongoose.Schema.Types.ObjectId,   ref: 'Reply'},
    replies: [{     type: mongoose.Schema.Types.ObjectId,   ref: 'Reply'}],
},{
    timestamps: true
} , { collection: 'topics' });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
