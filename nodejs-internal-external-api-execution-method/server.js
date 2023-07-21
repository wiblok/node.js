// モジュールをインポートします
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

// ユーザーを保存するための仮のデータストア
let users = [];

// HTMLページのパスを設定します
const indexFilePath = path.join(__dirname, "index.html");

// リクエストハンドラを作成します
const requestHandler = (req, res) => {
  const { pathname } = url.parse(req.url);

  switch (pathname) {
    case "/":
      fs.readFile(indexFilePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end(`Error loading ${indexFilePath}`);
        } else {
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        }
      });
      break;

    case "/users":
      if (req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(users));
      } else if (req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          const user = JSON.parse(body);
          users.push(user);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(user));
        });
      }
      break;

    default:
      res.writeHead(404);
      res.end(`404 - Page not found!`);
  }
};

// サーバーを作成して起動します
const server = http.createServer(requestHandler);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
