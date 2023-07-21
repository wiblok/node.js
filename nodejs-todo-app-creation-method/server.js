// モジュールをインポートします
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

// 一覧用の Todo を作成します
let todos = [
  { id: 1, text: "野球をする", completed: false },
  { id: 2, text: "ゲームをする", completed: false },
  { id: 3, text: "仕事をする", completed: false },
];

// リクエストハンドラを設定
const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const method = req.method;

  if (method === "GET") {
    if (parsedUrl.pathname === "/") {
      fs.readFile("index.html", (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        const html = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf8"
        );
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      });
    } else if (parsedUrl.pathname === "/todos") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todos));
    }
  } else if (method === "POST") {
    if (parsedUrl.pathname === "/todos") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const newTodo = JSON.parse(body);
        newTodo.id = todos.length + 1;
        todos.push(newTodo);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ todo: newTodo }));
      });
    }
  } else if (method === "PUT") {
    const regex = /\/todos\/([0-9]+)/;
    const match = regex.exec(parsedUrl.pathname);
    if (match) {
      const id = match[1];
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let todo = todos.find((t) => t.id == id);
        if (todo) {
          Object.assign(todo, JSON.parse(body));
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ todo }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Todo が見つかりません" }));
        }
      });
    }
  } else if (method === "DELETE") {
    const regex = /\/todos\/([0-9]+)/;
    const match = regex.exec(parsedUrl.pathname);
    if (match) {
      const id = match[1];
      const index = todos.findIndex((t) => t.id == id);
      if (index !== -1) {
        todos.splice(index, 1);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Todo が削除されました" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Todo が見つかりません" }));
      }
    }
  }
};

// ポート 3000 番でサーバーをリッスンします
const server = http.createServer(requestHandler);
server.listen(3000, () => {
  console.log(`サーバーがポート3000でリッスン中です`);
});
