//いま書いているコードは/app/streamsにアクセスしたらtwitchのlol配信者情報を取得して、/api/twitch/
// app.js
// ルーティング
// API定義
// アプリ本体

const express = require("express");
const mongoose = require("mongoose");
//const axios = require("axios");

const app = express();
const streamersRouter = require("./routes/streamers");
//const twitchRouter = require("./routes/twitch");
//const streamRouter = require("./routes/stream");
//const Streamer = require("./models/Streamer");

//console.log(process.env.TWITCH_CLIENT_ID);

//shift alt A
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

//bodyパースミドルウェア
//JSON形式のbodyが来たら、JavaScriptオブジェクトに変換してreq.bodyに入れておく
app.use(express.json());
app.use("/api/streamers", streamersRouter);
//app.use("/api/twitch",twitchRouter);
//app.use("/api/streams", streamRouter);
app.use(express.static("public"));//html読み込み
module.exports = app;