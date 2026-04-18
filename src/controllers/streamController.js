//Controller = 「機能ごとの箱」
const { fetchLolStreams, fetchStreamsByUsers } = require("../services/twitchService");
const { fetchRankByPuuid, fetchPuuid } = require("../services/riotService");
const Streamer = require("../models/Streamer");

//配信者一覧取得
async function getLiveStreams(req, res) {
  try {
    // ① DB配信者取得
    const streamers = await Streamer.find().lean();
    console.log("📦 streamers(DB):", streamers.length);

    // 🔥 twitchName一覧
    const userLogins = streamers.map((s) =>
      s.twitchName.toLowerCase()
    );

    console.log("対象ユーザー:", userLogins);

    // ② 登録者だけTwitch取得
    const liveStreams = await fetchStreamsByUsers(userLogins);
    console.log("🎥 liveStreams:", liveStreams.length);

    // 🔥 高速化：Map化
    const streamerMap = new Map(
      streamers.map((s) => [s.twitchName.toLowerCase(), s])
    );

    // 確認用
    console.log("liveStreams:", liveStreams.map(s => s.user_login));
    console.log("DB:", streamers.map(s => s.twitchName));

    // ③ 結合＋ランク取得
    const result = await Promise.all(
      liveStreams.map(async (live) => {
        const matched = streamerMap.get(live.user_login.toLowerCase());

        if (!matched) return null;

        let rank = null;

        if (matched.puuid) {
          const rankData = await fetchRankByPuuid(
            matched.puuid,
            matched.region
          );

          // 👇 デバッグ用（ここ重要）
          console.log("rankData:", rankData);

          // ソロQ
          const soloRank = rankData.find(
            (r) => r.queueType === "RANKED_SOLO_5x5"
          );

          // フレックス（保険）
          const flexRank = rankData.find(
            (r) => r.queueType === "RANKED_FLEX_SR"
          );

          const targetRank = soloRank || flexRank;

          if (targetRank) {
            rank = `${targetRank.tier} ${targetRank.rank} (${targetRank.leaguePoints}LP)`;
          }
        }

        return {
          twitchName: live.user_name,
          title: live.title,
          viewerCount: live.viewer_count,
          language: live.language,
          url: `https://www.twitch.tv/${live.user_login}`,
          thumbnail: live.thumbnail_url
            .replace("{width}", "320")
            .replace("{height}", "180"),
          rank: rank || "Unranked",
        };
      })
    );

    // null除去
    const filtered = result.filter(Boolean);

    res.json(filtered);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "取得失敗" });
  }
}

//配信者登録（追加）
const createStreamer = async (req, res) => {
  console.log("createStreamer内");//テスト用
  console.log("② req.body:", req.body);//テスト用2
  try {
    const { twitchName, gameName, tagLine, region } = req.body;

    //重複チェック（おすすめ）
    const existing = await Streamer.findOne({ twitchName });
    if (existing) {
      return res.status(400).json({ error: "既に登録されています" });
    }
    let puuid = null;

    //PUUID自動取得
    if (gameName && tagLine) {
      try {
        const cleanTagLine = tagLine.replace("#", "");
        puuid = await fetchPuuid(gameName, cleanTagLine);
      } catch (e) {
        return res.status(400).json({ error: "RiotIDが不正です" });
      }
    }
    const streamer = new Streamer({
      twitchName,
      gameName,
      tagLine,
      region,
      puuid,
    });
    await streamer.save();
    res.json(streamer);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "登録失敗" });
  }
};

module.exports = {
  getLiveStreams,
  createStreamer,
};