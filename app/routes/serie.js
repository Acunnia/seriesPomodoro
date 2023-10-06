const express = require("express");
const passport = require("passport");
const checkPermissionMiddleware = require("../utils/checkPermission");

const serieController = express.Router();
const Serie = require("../models/serie.model");

serieController.get("/", (req, res) => {
  Serie.find().then((series) => {
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

serieController.put(
  "/edit/:serieID",
  passport.authenticate("jwt", { session: false }),
  checkPermissionMiddleware("edit_serie"),
  async (req, res) => {
    const serieID = req.params.serieID;

    // Datos que deseas actualizar
    const updatedData = {
      nombre: req.body.nombre,
      categoria: req.body.categoria,
      categoriaID: req.body.categoriaID,
      streamers: req.body.streamers,
      activa: req.body.activa,
      fin: req.body.fin,
      inicio: req.body.inicio,
      relatedTopic: req.body.relatedTopic,
    };

    try {
      // Encuentra y actualiza la serie por su ID
      const updatedSerie = await Serie.findOneAndUpdate(
        { _id: serieID },
        updatedData,
        { new: true } // Para devolver el documento actualizado
      );

      if (!updatedSerie) {
        return res.status(404).json({ message: "Serie no encontrada" });
      }

      return res.status(200).json(updatedSerie);
    } catch (error) {
      console.error("Error al actualizar la serie:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

serieController.delete(
  "/delete/:serieID",
  passport.authenticate("jwt", { session: false }),
  checkPermissionMiddleware("delete_serie"),
  async (req, res) => {
    const serieID = req.params.serieID;

    try {
      const serie = await Serie.findById(serieID);

      if (!serie) {
        return res.status(404).json({ message: "Serie was not found" });
      }

      await Serie.deleteOne({ _id: serieID });

      return res.json({ message: "Serie was deleted" });
    } catch (error) {
      return res.status(500).json({
        message: "Error trying to delete the serie",
        error: error.message,
      });
    }
  }
);

module.exports = serieController;
