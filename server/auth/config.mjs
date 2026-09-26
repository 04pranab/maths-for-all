const number = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
};

const origin = process.env.AUTH_ORIGIN || '';
const cookieSecure = process.env.AUTH_COOKIE_SECURE
  ? process.env.AUTH_COOKIE_SECURE === 'true'
  : origin.startsWith('https://');

export const config = {
  port: number('AUTH_PORT', 8080),
  sessionTtlSeconds: number('AUTH_SESSION_TTL_SECONDS', 8 * 60 * 60),
  origin,
  emailDeliveryUrl: process.env.AUTH_EMAIL_DELIVERY_URL || '',
  emailDeliveryToken: process.env.AUTH_EMAIL_DELIVERY_TOKEN || '',
  emailFrom: process.env.AUTH_EMAIL_FROM || '',
  databaseUrl: process.env.DATABASE_URL || '',
  databasePoolMax: number('DATABASE_POOL_MAX', 5),
  cookieSecure,
  sessionCookieName: cookieSecure ? '__Host-mfa_session' : 'mfa_session'
};

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required.');
}

if (config.sessionTtlSeconds < 900 || config.sessionTtlSeconds > 30 * 24 * 60 * 60) {
  throw new Error('AUTH_SESSION_TTL_SECONDS must be between 900 and 2592000.');
}

if (config.cookieSecure && !config.origin.startsWith('https://')) {
  throw new Error('AUTH_COOKIE_SECURE=true requires an HTTPS AUTH_ORIGIN.');
}
