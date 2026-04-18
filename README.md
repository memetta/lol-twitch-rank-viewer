# lol-twitch-rank-viewer
lol-twitch-rank-viewer
# 🎮 LoL Twitch Rank Viewer

Twitchで配信中のLeague of Legends配信者のランクをリアルタイムで表示するWebアプリです。

---

## 🔍 概要

登録した配信者の中から、現在配信中のユーザーのみを取得し、
そのプレイヤーのランク（ソロQ / フレックス）を表示します。

---

## 🚀 デモ

※ ローカルで動作します

---

## 🛠 使用技術

* Node.js
* Express
* MongoDB（Mongoose）
* Twitch API
* Riot API

---

## ✨ 主な機能

* 🎥 配信中のTwitch配信者を取得
* 👤 登録済み配信者のみ表示（精度向上）
* 🏆 ランク表示（ソロQ優先・フレックス対応）
* ⚡ Map + Promise.all による高速処理
* 🔐 Twitchトークン自動取得（有効期限対応）

---

## 📦 セットアップ

### ① クローン

```bash
git clone https://github.com/memetta/lol-twitch-rank-viewer.git
cd lol-twitch-rank-viewer
```

---

### ② パッケージインストール

```bash
npm install
```

---

### ③ 環境変数設定

`.env` ファイルを作成

```env
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret

RIOT_API_KEY=your_riot_api_key
```

---

### ④ 起動

```bash
npm start
```

---

## 📡 API仕様

### GET /api/streams

配信中の登録配信者一覧を取得

```json
[
  {
    "twitchName": "example",
    "title": "配信タイトル",
    "viewerCount": 1000,
    "language": "ja",
    "url": "https://twitch.tv/example",
    "thumbnail": "https://...",
    "rank": "GOLD I (50LP)"
  }
]
```

---

## 🔧 工夫した点

* Twitch APIの制限回避のため、登録配信者のみを対象に取得
* Mapを使用してO(1)で高速照合
* Promise.allで非同期処理を並列化
* トークンのキャッシュでAPI負荷軽減

---

## ⚠️ 注意点

* Riot APIキーは一定時間で期限切れになります
* Twitchアクセストークンは自動取得しています

---

## 📈 今後の改善

* 配信していないユーザーの表示
* ランクキャッシュ機能
* フロントエンドUIの実装
* デプロイ（Render / Vercel）

---

## 👤 作成者

* GitHub: https://github.com/memetta

---

## 📄 ライセンス

MIT License
