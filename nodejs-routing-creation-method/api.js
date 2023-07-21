const http = require("http");
const url = require("url");

let users = {}; // メモリ内のユーザー情報のストレージ

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  const chosenHandler =
    typeof router[req.method][trimmedPath] !== "undefined"
      ? router[req.method][trimmedPath]
      : handlers.notFound;

  collectRequestData(req, (result) => {
    chosenHandler(result, (statusCode, payload) => {
      res.writeHead(statusCode);
      res.end(JSON.stringify(payload));
    });
  });
});

function collectRequestData(request, callback) {
  const FORM_URLENCODED = "application/json";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(JSON.parse(body));
    });
  } else {
    callback(null);
  }
}

server.listen(3000, () => {
  console.log("サーバーがポート3000で起動しました");
});

const handlers = {
  getUsers: (data, callback) => {
    callback(200, users); // 全ユーザーを返す
  },
  postUser: (data, callback) => {
    const { id, name } = data;
    if (id && name) {
      users[id] = { name }; // ユーザーを追加
      callback(200, { id, name });
    } else {
      callback(400, { error: "Missing required fields" });
    }
  },
  putUser: (data, callback) => {
    callback(200, { name: "put user handler", data: data });
  },
  deleteUser: (data, callback) => {
    const { id } = data;
    if (id && users[id]) {
      delete users[id]; // ユーザーを削除
      callback(200, { id });
    } else {
      callback(400, { error: "Invalid user id" });
    }
  },
  notFound: (data, callback) => {
    callback(404);
  },
};

const router = {
  GET: {
    users: handlers.getUsers,
  },
  POST: {
    users: handlers.postUser,
  },
  PUT: {
    users: handlers.putUser,
  },
  DELETE: {
    users: handlers.deleteUser,
  },
};
