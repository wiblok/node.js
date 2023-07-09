const http = require("http");
const axios = require("axios");

const requestHandler = async (req, res) => {
  if (req.url === "/data" && req.method === "GET") {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response.data));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: "Error occurred" }));
    }
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
};

const server = http.createServer(requestHandler);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
