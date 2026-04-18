// server.js
// 起動だけする
// ポート管理
// 環境変数読み込み
require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});