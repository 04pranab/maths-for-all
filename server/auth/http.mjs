import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.mjs';
import { getUserBySession, login, logout, register, resendVerification, verifyEmail, requestPasswordReset, resetPassword } from './service.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 64 * 1024) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); }
      catch { reject(new Error('Invalid JSON request.')); }
    });
    req.on('error', reject);
  });
}

function cookieToken(req) {
  const cookies = String(req.headers.cookie || '').split(';');
  const item = cookies.map(x => x.trim()).find(x => x.startsWith('__Host-mfa_session='));
  return item ? decodeURIComponent(item.slice('__Host-mfa_session='.length)) : '';
}

function sameOrigin(req) {
  if (!config.origin) return true;
  const origin = req.headers.origin;
  return !origin || origin === config.origin;
}

function setSessionCookie(res, token, maxAge) {
  res.setHeader(
    'Set-Cookie',
    '__Host-mfa_session=' + encodeURIComponent(token) +
    '; Max-Age=' + maxAge + '; Path=/; HttpOnly; Secure; SameSite=Lax'
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', '__Host-mfa_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax');
}

function securityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
}

export async function handleRequest(req, res) {
  securityHeaders(res);
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname.startsWith('/api/')) {
    if (!sameOrigin(req)) return sendJson(res, 403, { error: 'Cross-origin request rejected.' });

    try {
      if (req.method === 'GET' && url.pathname === '/api/health') {
        return sendJson(res, 200, { status: 'ok', service: 'maths-for-all-auth' });
      }
      if (req.method === 'GET' && url.pathname === '/api/auth/me') {
        const user = getUserBySession(cookieToken(req));
        return user ? sendJson(res, 200, { authenticated: true, user })
          : sendJson(res, 401, { authenticated: false });
      }
      if (req.method === 'POST' && url.pathname === '/api/auth/register') {
        const user = await register(await readBody(req));
        return sendJson(res, 201, { user });
      }
      if (req.method === 'POST' && url.pathname === '/api/auth/login') {
        const result = await login(await readBody(req));
        setSessionCookie(res, result.token, config.sessionTtlSeconds);
        return sendJson(res, 200, { user: result.user, expiresAt: result.expiresAt });
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/verify-email') {
        return sendJson(res, 200, await verifyEmail((await readBody(req)).token));
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/resend-verification') {
        return sendJson(res, 202, await resendVerification((await readBody(req)).identifier));
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/password-reset/request') {
        return sendJson(res, 202, await requestPasswordReset((await readBody(req)).email));
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/password-reset/confirm') {
        const body = await readBody(req);
        return sendJson(res, 200, await resetPassword(body.token, body.password));
      }
      if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
        logout(cookieToken(req));
        clearSessionCookie(res);
        return sendJson(res, 200, { ok: true });
      }
      return sendJson(res, 404, { error: 'Not found.' });
    } catch (error) {
      const message = error?.message || 'Request failed.';
      const status = message.includes('incorrect') ? 401 : 400;
      return sendJson(res, status, { error: message });
    }
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  const root = path.resolve('.');
  const requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const target = path.resolve(root, '.' + requested);
  if (target !== root && !target.startsWith(root + path.sep)) {
    res.writeHead(400);
    return res.end('Bad path');
  }
  if (target.includes(path.sep + '.git' + path.sep) ||
      target.endsWith('.sqlite') || target.endsWith('.sqlite-shm') ||
      target.endsWith('.sqlite-wal') || target.endsWith('.env')) {
    res.writeHead(404);
    return res.end('Not found');
  }

  try {
    const stat = fs.statSync(target);
    if (!stat.isFile()) throw new Error('Not a file');
    const type = MIME[path.extname(target)] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': target.endsWith('index.html') ? 'no-cache' : 'public, max-age=3600'
    });
    if (req.method === 'HEAD') return res.end();
    res.end(fs.readFileSync(target));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}
