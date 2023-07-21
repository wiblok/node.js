var http = require("http");
var dt = require("./localmodule");

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("現在日付は: " + dt.myDateTime());
    res.end();
  })
  .listen(3000);
