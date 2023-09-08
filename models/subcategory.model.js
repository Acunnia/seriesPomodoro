const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: {         type: String,       required: true},
    category: {     type: mongoose.Schema.Types.ObjectId,   ref: 'Category', required: true},
    lastreply: {     type: mongoose.Schema.Types.ObjectId,   ref: 'Reply'},
    topics: [{      type: mongoose.Schema.Types.ObjectId,   ref: 'Topic'}]
}, { collection: 'subcategories' });


const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
