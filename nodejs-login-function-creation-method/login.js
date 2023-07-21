const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const ejs = require("ejs");

// 仮のユーザーデータベース
const users = {
  user1: "pass1",
  user2: "pass2",
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // Parse URL
  const pathName = parsedUrl.pathname;

  if (req.method === "GET") {
    if (pathName === "/") {
      // Render the index page
      ejs.renderFile(
        path.join(__dirname, "/views/index.ejs"),
        {},
        (err, str) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(str);
        }
      );
    } else if (pathName === "/dashboard") {
      // Render the dashboard page
      ejs.renderFile(
        path.join(__dirname, "/views/dashboard.ejs"),
        { username: "user1" },
        (err, str) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(str);
        }
      );
    }
  } else if (req.method === "POST") {
    if (pathName === "/login") {
      // Handle login
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const parsedBody = querystring.parse(body);

        // ユーザー名とパスワードのチェック
        if (
          users[parsedBody.username] &&
          users[parsedBody.username] === parsedBody.password
        ) {
          res.end("Login successful");
        } else {
          res.end("Login failed");
        }
      });
    }
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
