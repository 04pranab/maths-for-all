import http from 'node:http';

try {
  process.loadEnvFile('.env.local');
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const { closeDatabase, verifyDatabaseSchema } = await import('./db/postgres.mjs');
const { config } = await import('./auth/config.mjs');
const { handleRequest } = await import('./auth/http.mjs');

async function start() {
  await verifyDatabaseSchema();

  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(() => {
      if (!res.headersSent) res.writeHead(500);
      res.end('Internal server error.');
    });
  });

  server.listen(config.port, () => {
    console.log(
      'Maths for All server listening on http://127.0.0.1:' + config.port
    );
  });

  function shutdown() {
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch(error => {
  console.error(error.message);
  process.exit(1);
});
