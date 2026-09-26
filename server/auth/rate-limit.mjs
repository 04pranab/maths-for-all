const WINDOW_MS = 60 * 1000;

const RULES = {
  register: { limit: 5, windowMs: WINDOW_MS },
  login: { limit: 10, windowMs: WINDOW_MS },
  resendVerification: { limit: 5, windowMs: WINDOW_MS },
  passwordResetRequest: { limit: 5, windowMs: WINDOW_MS },
  passwordResetConfirm: { limit: 10, windowMs: WINDOW_MS },
  verifyEmail: { limit: 10, windowMs: WINDOW_MS }
};

const buckets = new Map();

function clientAddress(req) {
  return req.socket?.remoteAddress || 'unknown';
}

function key(req, action) {
  return action + ':' + clientAddress(req);
}

function cleanup(now) {
  for (const [id, bucket] of buckets) {
    if (now - bucket.startedAt >= bucket.windowMs) buckets.delete(id);
  }
}

export function checkRateLimit(req, action) {
  const rule = RULES[action];
  if (!rule) return { allowed: true, retryAfterSeconds: 0 };

  const now = Date.now();
  cleanup(now);

  const id = key(req, action);
  let bucket = buckets.get(id);

  if (!bucket || now - bucket.startedAt >= rule.windowMs) {
    bucket = { count: 0, startedAt: now, windowMs: rule.windowMs };
    buckets.set(id, bucket);
  }

  bucket.count += 1;

  if (bucket.count <= rule.limit) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.startedAt + rule.windowMs - now) / 1000))
  };
}

export function resetRateLimits() {
  buckets.clear();
}
