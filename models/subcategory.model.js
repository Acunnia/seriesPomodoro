const mongoose = require('mongoose');
const shortid = require('shortid');

const subcategorySchema = new mongoose.Schema({
    name: {         type: String,       required: true},
    description: {  type: String},
    category: {     type: mongoose.Schema.Types.ObjectId,   ref: 'Category'},
    lastreply: {     type: mongoose.Schema.Types.ObjectId,   ref: 'Reply'},
    topics: [{      type: mongoose.Schema.Types.ObjectId,   ref: 'Topic'}]
}, { collection: 'subcategories' });


const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;