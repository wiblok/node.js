const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // リクエストヘッダーの取得
  const headers = req.headers;

  // クエリパラメータの取得
  const queryParam = url.parse(req.url, true).query;

  const response = {
    headers: headers,
    queryParam: queryParam,
  };

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});