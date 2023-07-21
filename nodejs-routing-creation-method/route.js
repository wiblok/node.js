const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  const chosenHandler =
    typeof router[trimmedPath] !== "undefined"
      ? router[trimmedPath]
      : handlers.notFound;

  chosenHandler((statusCode, payload) => {
    res.writeHead(statusCode);
    res.end(JSON.stringify(payload));
  });
});

server.listen(3000, () => {
  console.log("サーバーがポート3000で起動しました");
});

const handlers = {
  sample: (callback) => {
    callback(200, { name: "sample handler" });
  },
  notFound: (callback) => {
    callback(404);
  },
};

const router = {
  sample: handlers.sample,
  notFound: handlers.notFound,
};
