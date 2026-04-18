//ここでトークン管理をする
const axios = require("axios");

let cachedToken = null;
let tokenExpireTime = null;

let cachedStreams = null;
let streamsExpireTime = null;

//twitchService.js内部で使用する用の関数
async function getAccessToken() {
  // まだ有効なら再利用
  if (cachedToken && tokenExpireTime > Date.now()) {
    return cachedToken;
  }

  const tokenResponse = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
    }
  );

  cachedToken = tokenResponse.data.access_token;
  tokenExpireTime = Date.now() + tokenResponse.data.expires_in * 1000;

  return cachedToken;
}

async function fetchLolStreams() {//後で調べる

  //ここがキャッシュ判定
  if (cachedStreams && streamsExpireTime > Date.now()) {
    console.log("キャッシュ使用");
    return cachedStreams;
  }

  const accessToken = await getAccessToken();

  const streamResponse = await axios.get(
    "https://api.twitch.tv/helix/streams",
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        game_id: "21779",
        first: 100,
      },
    }
  );
  //Serviceはデータを取得するための部品であるべきなので、データを返す。res.json(streamResponse.data);とはしない
  cachedStreams = streamResponse.data.data;
  streamsExpireTime = Date.now() + 60 * 1000; // 60秒キャッシュ
  
  return cachedStreams;
}

async function fetchStreamsByUsers(userLogins) {
  const params = new URLSearchParams();

  userLogins.forEach((login) => {
    params.append("user_login", login);
  });

  // 🔥 トークンを毎回取得（キャッシュ付き）
  const token = await getAccessToken();

  const response = await axios.get(
    `https://api.twitch.tv/helix/streams?${params.toString()}`,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
}

module.exports = { fetchLolStreams, fetchStreamsByUsers };//getAccesstokenから変更　app.get("/api/twitch/lol-streams"を削除か？