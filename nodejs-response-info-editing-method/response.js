const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const path = url.parse(req.url, true).pathname;

  switch (path) {
    case "/json":
      const jsonResponse = {
        message: "This is a JSON response",
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(jsonResponse));
      break;

    case "/html":
      const htmlResponse = "<h1>This is an HTML response</h1>";
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(htmlResponse);
      break;

    case "/header":
      res.setHeader("Custom-Header", "Custom Value");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Header set");
      break;

    case "/status":
      res.writeHead(201, { "Content-Type": "text/plain" });
      res.end("Created");
      break;

    case "/error":
      const errorResponse = {
        error: "An error occurred",
      };
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify(errorResponse));
      break;

    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
