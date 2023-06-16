const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {         type: String,       required: true,     unique: true},
    subcategories: [{ type: mongoose.Schema.Types.ObjectId,   ref: 'Category' }],
}, { collection: 'categories' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
