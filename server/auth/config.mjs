import path from 'node:path';

const number = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
};

export const config = {
  port: number('AUTH_PORT', 8080),
  dbPath: process.env.AUTH_DB_PATH || './data/maths-for-all.sqlite',
  sessionTtlSeconds: number('AUTH_SESSION_TTL_SECONDS', 8 * 60 * 60),
  origin: process.env.AUTH_ORIGIN || '',
  emailDeliveryUrl: process.env.AUTH_EMAIL_DELIVERY_URL || '',
  emailDeliveryToken: process.env.AUTH_EMAIL_DELIVERY_TOKEN || '',
  emailFrom: process.env.AUTH_EMAIL_FROM || ''
};

if (config.sessionTtlSeconds < 900 || config.sessionTtlSeconds > 30 * 24 * 60 * 60) {
  throw new Error('AUTH_SESSION_TTL_SECONDS must be between 900 and 2592000.');
}
