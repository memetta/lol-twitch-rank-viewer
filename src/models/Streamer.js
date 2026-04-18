const mongoose = require("mongoose");

const streamerSchema = new mongoose.Schema({
  twitchName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  gameName: {
    type: String,
    required: true,
  },
  tagLine: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
    lowercase: true,
  },
  puuid: {
    type: String,
    index: true,
  },


});

module.exports = mongoose.model("Streamer", streamerSchema);