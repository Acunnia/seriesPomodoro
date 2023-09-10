const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {         type: String,       required: true,     unique: true},
    admin_level: {  type: Number,       required: true},
    users: [{ type: mongoose.Schema.Types.ObjectId,         ref: 'User'}],
}, { collection: 'roles' });

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
