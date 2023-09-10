const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    time: { type: String },
    track: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { collection: "tracks" }
);

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;
