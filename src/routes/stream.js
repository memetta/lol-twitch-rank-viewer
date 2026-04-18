//URLと処理を結びつけるだけ
const express = require("express");
const router = express.Router();
const { getLiveStreams } = require("../controllers/streamController");

router.get("/live", getLiveStreams);

module.exports = router;