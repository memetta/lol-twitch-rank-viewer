const express = require("express");
const router = express.Router();

// serviceを使う（重要）
const { fetchLolStreams } = require("../services/twitchService");

// GET /api/twitch/streams
router.get("/streams", async (req, res) => {
  try {
    const streams = await fetchLolStreams();

    res.json(streams);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Twitch取得失敗" });
  }
});

module.exports = router;