/* 配信取得
   ↓
DBから紐付けriot情報取得
   ↓
puuidを使ってランク取得
   ↓
キャッシュ保存 */

const axios = require("axios");

let rankCache = {};
// 形式:
// {
//   "puuid": { data: {...}, expire: 123456789 }
// }

//すでにPUUIDを持っている前提でランクだけ取得
//ランク取得（キャッシュ付き）
async function fetchRankByPuuid(puuid, region) {
  const now = Date.now();

  //キャッシュチェック
  if (
    rankCache[puuid] &&
    //有効期限がまだ切れていないか？
    rankCache[puuid].expire > now
  ) {
    console.log("Riotランク キャッシュ使用");
    return rankCache[puuid].data;
  }

  console.log("Riot API 呼び出し");

  const rankResponse = await axios.get(
    `https://${region}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    }
  );

  //5分キャッシュ
  rankCache[puuid] = {
    data: rankResponse.data,
    expire: now + 5 * 60 * 1000,
  };

  return rankResponse.data;
}

//RiotID → PUUID
/* async function fetchPuuid(gameName, tagLine) {
  const cleanTagLine = tagLine.replace("#", "");
  const encodedGameName = encodeURIComponent(gameName);
  const encodedTagLine = encodeURIComponent(cleanTagLine);
  const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;


  const response = await axios.get(
    `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    }
  );

  return response.data.puuid;
} */
async function fetchPuuid(gameName, tagLine) {
  const cleanTagLine = tagLine.replace("#", "");
  const encodedGameName = encodeURIComponent(gameName);
  const encodedTagLine = encodeURIComponent(cleanTagLine);
  const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;

  try {
    console.log("Riot API URL:", url);  // ← ここでURL確認
    console.log("Using API Key:", process.env.RIOT_API_KEY?.slice(0,5) + "..."); // ← キー先頭だけ表示

    const response = await axios.get(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    });

    console.log("Riot API success:", response.data); // ← 成功時データ確認
    return response.data.puuid;
  } catch (e) {
    console.error("Riot API error!");   // ← エラー発生時
    console.log("URL:", url);
    console.log("status:", e.response?.status);
    console.log("data:", e.response?.data);

    throw e; // エラーを上位に投げる
  }
}


module.exports = { fetchRankByPuuid, fetchPuuid,};