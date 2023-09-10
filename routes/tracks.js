const express = require("express");

const trackController = express.Router();
const Track = require("../models/track.model");
const Series = require("../models/serie.model");

trackController.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params;

    // Busca la serie por ID utilizando Mongoose (reemplaza esto con tu lógica de búsqueda)
    const series = await Series.findById(id);

    if (!series) {
      return res.status(404).json({ error: "Series not found" });
    }

    const startDate =
      series.inicio !== "" ? new Date(series.inicio) : new Date();
    const endDate = series.fin !== "" ? new Date(series.fin) : new Date();
    const tempID = series.categoriaID;
    const streamers = series.streamers.map((nombre) => ({
      "track.user_login": nombre.toString(),
    }));

    // Utiliza Mongoose para buscar pistas en lugar de acceder directamente a la colección de MongoDB
    const tracks = await Track.aggregate([
      { $unwind: "$track" },
      { $match: { "track.game_id": tempID } },
      { $match: { $or: streamers } },
      {
        $match: {
          time: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString(),
          },
        },
      },
      {
        $project: {
          time: "$time",
          views: "$track.viewer_count",
          streamer: "$track.user_login",
        },
      },
    ]);

    res.json(tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = trackController;
