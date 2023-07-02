const mongoose = require('mongoose');
const shortid = require("shortid");

const topicSchema = new mongoose.Schema({
    name: {         type: String,       required: true},
    description: {  type: String},
    category: {     type: mongoose.Schema.Types.ObjectId,   ref: 'Subcategory'}
}, { collection: 'topics' });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;