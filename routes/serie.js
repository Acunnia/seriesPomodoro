const express = require("express");

const serieController = express.Router();
const Serie = require("../models/serie.model");

serieController.get("/", (req, res) => {
  Serie.find().then((series) => {
    console.log(series);
    res.status(200).json({ series });
  });
});

serieController.post("/create", (req, res) => {
  const {
    nombre,
    categoria,
    categoriaID,
    streamers,
    activa,
    fin,
    inicio,
    relatedTopic,
  } = req.body;
  console.log("request ", req.body);
  Serie.create({
    nombre,
    categoria,
    categoriaID,
    streamers,
    activa,
    fin,
    inicio,
    relatedTopic,
  }).then((serie) => {
    console.log(serie);
    res.status(200).json({ serie });
  });
});

module.exports = serieController;
