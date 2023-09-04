const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    create_category: {      type: Number,    requiered: true},
    create_subcategory: {      type: Number,    requiered: true},
    edit_category: {      type: Number,    requiered: true},
    edit_subcategory: {      type: Number,    requiered: true},
    delete_subcategory: {      type: Number,    requiered: true},
    edit_user: {      type: Number,    requiered: true},
    delete_user: {      type: Number,    requiered: true},
    create_role: {      type: Number,    requiered: true},
    edit_role: {      type: Number,    requiered: true},
    delete_role: {      type: Number,    requiered: true},
}, { collection: 'appConfig' });

const AppConfig = mongoose.model('AppConfig', configSchema);

module.exports = AppConfig;