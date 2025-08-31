// CommonJS local runner for the Vercel function at api/bfhl.js
const http = require('http');
const url = require('url');
const handler = require('./api/bfhl.js'); // module.exports = function(req,res)

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  if (pathname === '/api/bfhl' || pathname === '/bfhl') {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      // Attach JSON body if present
      try {
        req.body = raw ? JSON.parse(raw) : {};
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ is_success: false, message: 'Invalid JSON' }));
      }

      // Minimal Express-like helpers expected by handler
      res.json = (obj) => {
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json');
        }
        res.end(JSON.stringify(obj));
      };
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      handler(req, res);
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Local bfhl running at http://localhost:${PORT}/bfhl`);
});
