// Minimal local runner for the Vercel serverless function at api/bfhl.js
import http from 'http';
import handler from './api/bfhl.js'; // ESM default export

const server = http.createServer((req, res) => {
  if (req.url === '/api/bfhl' || req.url === '/bfhl') {
    let raw = '';
    req.on('data', chunk => (raw += chunk));
    req.on('end', () => {
      // Attach body for the handler (mimic Vercel)
      try {
        req.body = raw ? JSON.parse(raw) : {};
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ is_success: false, message: 'Invalid JSON' }));
      }

      // Express-like helpers the handler expects
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
  console.log(`bfhl local server running on http://localhost:${PORT}/api/bfhl`);
});
