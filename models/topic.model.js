const mongoose = require('mongoose');
const shortid = require("shortid");

const topicSchema = new mongoose.Schema({
    shortid: {      type: String,       unique: true,       default: shortid.generate},
    name: {         type: String,       required: true},
    description: {  type: String},
    category: {     type: mongoose.Schema.Types.ObjectId,   ref: 'Category'}
}, { collection: 'topics' });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
