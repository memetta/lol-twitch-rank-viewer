// /api/streamers 以下のリクエストを処理する専用ミドルウェア
//jsonを返す
//DB確認用
const express = require("express");
const router = express.Router();
const Streamer = require("../models/Streamer");
//追加してみた
const { getLiveStreams, createStreamer} = require("../controllers/streamController");

// ① 一覧取得
// GET /api/streamers
router.get("/live",getLiveStreams);

// ② 新規登録
// POST /api/streamers
router.post("/", createStreamer);

// ③ 削除(仮)
// DELETE /api/streamers/:id
router.delete("/:id", async (req, res) => {
  try {
    await Streamer.findByIdAndDelete(req.params.id);
    res.json({ message: "削除成功" });
  } catch (error) {
    res.status(500).json({ error: "削除失敗" });
  }
});

module.exports = router;