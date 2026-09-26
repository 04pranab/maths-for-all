import http from 'node:http';
import { config } from './auth/config.mjs';
import { handleRequest } from './auth/http.mjs';

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(() => {
    if (!res.headersSent) res.writeHead(500);
    res.end('Internal server error.');
  });
});

server.listen(config.port, () => {
  console.log('Maths for All server listening on http://127.0.0.1:' + config.port);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
