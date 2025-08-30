// Minimal local runner for the Vercel serverless function at api/bfhl.js
import http from 'http';
import handler from './api/bfhl.js';

const server = http.createServer((req, res) => {
  const { url, method, headers } = req;

  if (url === '/api/bfhl') {
    let raw = '';
    req.on('data', chunk => (raw += chunk));
    req.on('end', () => {
      // Parse JSON if present
      if (raw && typeof raw === 'string') {
        try {
          req.body = JSON.parse(raw);
        } catch (e) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ is_success: false, message: 'Invalid JSON' }));
        }
      } else {
        req.body = {};
      }

      // Express-like helpers
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
