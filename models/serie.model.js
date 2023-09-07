const mongoose = require("mongoose");

const serieSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, required: true, unique: true },
    categoriaID: { type: String, required: true },
    streamers: { type: [String], required: true },
    activa: { type: Boolean, required: true },
    fin: { type: Date },
    inicio: { type: Date },
    relatedTopic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}
}, { collection: 'series' });

const Serie = mongoose.model("Serie", serieSchema);

module.exports = Serie;