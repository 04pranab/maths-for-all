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


if (process.env.NODE_ENV === 'production') {
  if (!/^https:\/\//i.test(config.origin)) {
    throw new Error('AUTH_ORIGIN must be an HTTPS origin in production.');
  }
  if (!config.emailFrom) {
    throw new Error('AUTH_EMAIL_FROM must be configured in production.');
  }
  if (!config.emailDeliveryUrl || !config.emailDeliveryToken) {
    throw new Error('AUTH_EMAIL_DELIVERY_URL and AUTH_EMAIL_DELIVERY_TOKEN must be configured in production.');
  }
}
