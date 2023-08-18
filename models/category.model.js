const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {         type: String,       required: true,     unique: true},
    description: {  type: String},
    image: {        type: String},
    subcategories: [{ type: mongoose.Schema.Types.ObjectId,   ref: 'Subcategory' }],
}, { collection: 'categories' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
