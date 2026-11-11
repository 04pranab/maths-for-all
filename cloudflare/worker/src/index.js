import { jsonResponse, handleCorsPreflight, withCors } from "./http.js";
import { ACTIVE_GAME_IDS, normalizeScore, MAX_GLOBAL_POINTS } from "./leaderboard/scoring.js";
import { validateAttempt } from "./leaderboard/validation.js";

const SESSION_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 310000;
const COOKIE = "mfa_session";
const USERNAME_RE = /^[a-z0-9_]{3,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const encoder = new TextEncoder();

function cleanUser(row) {
  return { id: row.id, username: row.username, createdAt: row.created_at };
}
function error(message, status = 400) {
  return jsonResponse({ error: message }, status);
}
function cookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  const item = raw.split(";").map(x => x.trim()).find(x => x.startsWith(name + "="));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : "";
}
function cookieHeader(token, maxAge = SESSION_SECONDS) {
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=None`;
}
async function digest(value) {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, "0")).join("");
}
function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function passwordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PASSWORD_ITERATIONS }, key, 256);
  const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=+$/g, "");
  return `pbkdf2-sha256$${PASSWORD_ITERATIONS}$${b64(salt)}$${b64(bits)}`;
}
async function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256") return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 100000 || iterations > 600000) return false;
  try {
    const decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
    const salt = decode(parts[2]), expected = decode(parts[3]);
    const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, expected.length * 8));
    return actual.length === expected.length && actual.every((v, i) => v === expected[i]);
  } catch { return false; }
}
async function body(request) {
  if (Number(request.headers.get("Content-Length") || 0) > 16384) throw new Error("Request too large.");
  const value = await request.json();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid JSON body.");
  return value;
}
async function rateLimit(request, env, action) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = await digest(action + ":" + ip);
  const now = Date.now();
  const row = await env.DB.prepare("SELECT hits, window_started FROM auth_rate_limits WHERE rate_key = ?").bind(key).first();
  if (!row || now - Number(row.window_started) >= 600000) {
    await env.DB.prepare("INSERT INTO auth_rate_limits(rate_key,hits,window_started) VALUES(?,1,?) ON CONFLICT(rate_key) DO UPDATE SET hits=1,window_started=excluded.window_started").bind(key, now).run();
    return true;
  }
  if (row.hits >= 20) return false;
  await env.DB.prepare("UPDATE auth_rate_limits SET hits=hits+1 WHERE rate_key=?").bind(key).run();
  return true;
}
async function currentUser(request, env) {
  const authorization = request.headers.get("Authorization") || "";
  const bearer = authorization.match(/^Bearer ([A-Za-z0-9_-]{32,100})$/);
  const raw = bearer ? bearer[1] : cookie(request, COOKIE);
  if (!raw) return null;
  const tokenHash = await digest(raw);
  const row = await env.DB.prepare(
    "SELECT u.id,u.username,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at > ?"
  ).bind(tokenHash, new Date().toISOString()).first();
  if (row) await env.DB.prepare("UPDATE sessions SET last_used_at=? WHERE token_hash=?").bind(new Date().toISOString(), tokenHash).run();
  return row || null;
}
async function createSession(userId, env) {
  const token = randomToken();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_SECONDS * 1000).toISOString();
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at <= ?").bind(now.toISOString()).run();
  await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at,created_at,last_used_at) VALUES(?,?,?,?,?)")
    .bind(await digest(token), userId, expires, now.toISOString(), now.toISOString()).run();
  return token;
}
async function register(request, env) {
  if (!await rateLimit(request, env, "register")) return error("Too many attempts. Please try again in ten minutes.", 429);
  const input = await body(request);
  const username = String(input.username || "").trim().toLowerCase();
  const email = String(input.email || "").trim().toLowerCase();
  const password = input.password;
  if (!USERNAME_RE.test(username)) return error("Username must be 3–30 characters: lowercase letters, numbers, or underscores.");
  if (!EMAIL_RE.test(email) || email.length > 254) return error("Enter a valid email address.");
  if (typeof password !== "string" || password.length < 8 || password.length > 128) return error("Password must be 8–128 characters.");
  const id = crypto.randomUUID(), now = new Date().toISOString();
  const hash = await passwordHash(password);
  try {
    await env.DB.prepare("INSERT INTO users(id,username,email,password_hash,created_at,updated_at) VALUES(?,?,?,?,?,?)")
      .bind(id, username, email, hash, now, now).run();
  } catch (e) {
    if (/UNIQUE|constraint/i.test(String(e))) return error("That username or email is already in use.", 409);
    throw e;
  }
  const token = await createSession(id, env);
  return jsonResponse({ authenticated: true, user: { id, username, createdAt: now }, sessionToken: token }, 201, { "Set-Cookie": cookieHeader(token) });
}
async function login(request, env) {
  if (!await rateLimit(request, env, "login")) return error("Too many attempts. Please try again in ten minutes.", 429);
  const input = await body(request);
  const identifier = String(input.identifier || input.username || "").trim().toLowerCase();
  if (!identifier || typeof input.password !== "string") return error("Enter your username or email and password.");
  const row = await env.DB.prepare("SELECT id,username,email,password_hash,created_at FROM users WHERE username=? OR email=? LIMIT 1").bind(identifier, identifier).first();
  if (!row || !await verifyPassword(input.password, row.password_hash)) return error("The username/email or password is incorrect.", 401);
  const token = await createSession(row.id, env);
  return jsonResponse({ authenticated: true, user: cleanUser(row), sessionToken: token }, 200, { "Set-Cookie": cookieHeader(token) });
}
async function submitAttempt(request, env, user, gameId) {
  const input = await body(request);
  const checked = validateAttempt({ ...input, gameId });
  if (!checked.ok) return error(checked.error);
  const a = checked.value, now = new Date().toISOString();
  if (a.gameId === "traffic-control") {
    const inserted = await env.DB.prepare("INSERT OR IGNORE INTO traffic_control_attempts(attempt_id,user_id,score_percent,points,duration_seconds,created_at) VALUES(?,?,?,?,?,?)")
      .bind(a.attemptId,user.id,a.scorePercent,a.points,a.durationSeconds,now).run();
    if (inserted.meta?.changes) {
      await env.DB.prepare(`INSERT INTO traffic_control_best_scores(user_id,points,duration_seconds,achieved_at)
        VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET
        points=excluded.points,duration_seconds=excluded.duration_seconds,achieved_at=excluded.achieved_at
        WHERE excluded.points > traffic_control_best_scores.points`)
        .bind(user.id,a.points,a.durationSeconds,now).run();
    } else {
      const prior=await env.DB.prepare("SELECT user_id FROM traffic_control_attempts WHERE attempt_id=?").bind(a.attemptId).first();
      if(!prior||prior.user_id!==user.id)return error("Attempt ID already used.",409);
    }
    const best=await env.DB.prepare("SELECT points,duration_seconds,achieved_at FROM traffic_control_best_scores WHERE user_id=?").bind(user.id).first();
    return jsonResponse({accepted:true,duplicate:!inserted.meta?.changes,points:a.points,best});
  }
  const inserted = await env.DB.prepare("INSERT OR IGNORE INTO game_attempts(attempt_id,user_id,game_id,score_percent,points,duration_seconds,created_at) VALUES(?,?,?,?,?,?,?)")
    .bind(a.attemptId, user.id, a.gameId, a.scorePercent, a.points, a.durationSeconds, now).run();
  if (inserted.meta?.changes) {
    await env.DB.prepare(`INSERT INTO best_game_scores(user_id,game_id,points,duration_seconds,achieved_at)
      VALUES(?,?,?,?,?)
      ON CONFLICT(user_id,game_id) DO UPDATE SET
        points=excluded.points,duration_seconds=excluded.duration_seconds,achieved_at=excluded.achieved_at,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
      WHERE excluded.points > best_game_scores.points`)
      .bind(user.id, a.gameId, a.points, a.durationSeconds, now).run();
  } else {
    const prior = await env.DB.prepare("SELECT user_id,game_id FROM game_attempts WHERE attempt_id=?").bind(a.attemptId).first();
    if (!prior || prior.user_id !== user.id || prior.game_id !== a.gameId) return error("Attempt ID already used.", 409);
  }
  const best = await env.DB.prepare("SELECT points,duration_seconds,achieved_at FROM best_game_scores WHERE user_id=? AND game_id=?").bind(user.id, a.gameId).first();
  return jsonResponse({ accepted: true, duplicate: !inserted.meta?.changes, points: a.points, best });
}
async function globalLeaderboard(env, limit) {
  const result = await env.DB.prepare(`WITH scores AS (
      SELECT user_id,game_id,points,duration_seconds FROM best_game_scores
      UNION ALL SELECT user_id,'traffic-control' AS game_id,points,duration_seconds FROM traffic_control_best_scores
    )
    SELECT u.username,SUM(s.points) AS points,COUNT(s.game_id) AS games_played
    FROM users u JOIN scores s ON s.user_id=u.id
    GROUP BY u.id,u.username
    ORDER BY points DESC,u.username COLLATE NOCASE ASC LIMIT ?`).bind(limit).all();
  return result.results || [];
}
async function route(request, env) {
  const url = new URL(request.url), path = url.pathname, method = request.method;
  if (path === "/health" || path === "/api/health") {
    const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM users").first();
    return jsonResponse({ status: "ok", service: "maths-for-all-api", database: "connected", features: { accounts: true, leaderboards: true }, accounts: count.count });
  }
  if (method === "POST" && path === "/api/auth/register") return register(request, env);
  if (method === "POST" && path === "/api/auth/login") return login(request, env);
  if (method === "POST" && path === "/api/auth/logout") {
    const raw = cookie(request, COOKIE);
    if (raw) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(raw)).run();
    return jsonResponse({ ok: true }, 200, { "Set-Cookie": cookieHeader("", 0) });
  }
  if (method === "GET" && path === "/api/auth/me") {
    const user = await currentUser(request, env);
    return jsonResponse({ authenticated: Boolean(user), user: user ? cleanUser(user) : null });
  }
  if (method === "POST" && path.startsWith("/api/games/") && path.endsWith("/attempts")) {
    const user = await currentUser(request, env);
    if (!user) return error("Sign in to save a score. Guest play remains available.", 401);
    const gameId = path.slice("/api/games/".length, -"/attempts".length);
    return submitAttempt(request, env, user, gameId);
  }
  if (method === "GET" && path === "/api/leaderboards/global") {
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 25)));
    const rows = await globalLeaderboard(env, limit);
    return jsonResponse({ entries: rows.map((r,i)=>({ rank:i+1, username:r.username, points:r.points, gamesPlayed:r.games_played })), maximumPoints: MAX_GLOBAL_POINTS });
  }
  if (method === "GET" && path.startsWith("/api/leaderboards/games/")) {
    const gameId = path.slice("/api/leaderboards/games/".length);
    if (!ACTIVE_GAME_IDS.includes(gameId)) return error("Unknown or inactive game.", 404);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 25)));
    const result = gameId === "traffic-control"
      ? await env.DB.prepare(`SELECT u.username,b.points,b.duration_seconds FROM traffic_control_best_scores b JOIN users u ON u.id=b.user_id ORDER BY b.points DESC,b.achieved_at ASC,u.username COLLATE NOCASE ASC LIMIT ?`).bind(limit).all()
      : await env.DB.prepare(`SELECT u.username,b.points,b.duration_seconds FROM best_game_scores b JOIN users u ON u.id=b.user_id WHERE b.game_id=? ORDER BY b.points DESC,b.achieved_at ASC,u.username COLLATE NOCASE ASC LIMIT ?`).bind(gameId, limit).all();
    return jsonResponse({ gameId, entries:(result.results||[]).map((r,i)=>({rank:i+1,username:r.username,points:r.points,durationSeconds:r.duration_seconds})) });
  }
  if (method === "GET" && path === "/api/players/me/stats") {
    const user = await currentUser(request, env);
    if (!user) return error("Sign in to view account statistics.", 401);
    const scores = await env.DB.prepare(`SELECT game_id,points,duration_seconds,achieved_at FROM best_game_scores WHERE user_id=?
      UNION ALL SELECT 'traffic-control' AS game_id,points,duration_seconds,achieved_at FROM traffic_control_best_scores WHERE user_id=?
      ORDER BY game_id`).bind(user.id,user.id).all();
    const total = (scores.results||[]).reduce((n,r)=>n+r.points,0);
    return jsonResponse({ user:cleanUser(user), scores:scores.results||[], totalPoints:total, maximumPoints:MAX_GLOBAL_POINTS });
  }
  if (method === "DELETE" && path === "/api/players/me") {
    const user = await currentUser(request, env);
    if (!user) return error("Sign in to delete your account.", 401);
    await env.DB.prepare("DELETE FROM users WHERE id=?").bind(user.id).run();
    return jsonResponse({ ok:true },200,{"Set-Cookie":cookieHeader("",0)});
  }
  return error("Not found.",404);
}
export default {
  async fetch(request, env) {
    const preflight = handleCorsPreflight(request, env);
    if (preflight) return preflight;
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/") && url.pathname !== "/health") return jsonResponse({error:"not_found"},404);
    try {
      const response = await route(request, env);
      return withCors(response, request, env);
    } catch (e) {
      console.error("Maths For All API error", e);
      return withCors(error("The service could not complete that request. Please try again.",500),request,env);
    }
  }
};
