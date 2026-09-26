import fs from 'node:fs';
import { config } from './config.mjs';

async function deliver(payload) {
  if (config.emailDeliveryUrl) {
    const response = await fetch(config.emailDeliveryUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(config.emailDeliveryToken ? { authorization: 'Bearer ' + config.emailDeliveryToken } : {})
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Email delivery service rejected the message.');
    return;
  }

  if (process.env.AUTH_TEST_OUTBOX_PATH) {
    fs.appendFileSync(process.env.AUTH_TEST_OUTBOX_PATH, JSON.stringify(payload) + '\n');
    return;
  }

  throw new Error('No email delivery service is configured.');
}

function requireSecureOrigin() {
  if (!config.origin || !/^https:\/\//i.test(config.origin)) {
    if (process.env.NODE_ENV === 'production') throw new Error('AUTH_ORIGIN must use HTTPS in production.');
  }
}

export async function sendVerificationEmail({ email, username, token }) {
  requireSecureOrigin();
  const url = config.origin + '/?verify=' + encodeURIComponent(token);
  return deliver({
    type: 'email-verification',
    from: config.emailFrom,
    to: email,
    username,
    subject: 'Verify your Maths for All account',
    text: 'Verify your Maths for All account: ' + url
  });
}

export async function sendPasswordResetEmail({ email, username, token }) {
  requireSecureOrigin();
  const url = config.origin + '/?reset=' + encodeURIComponent(token);
  return deliver({
    type: 'password-reset',
    from: config.emailFrom,
    to: email,
    username,
    subject: 'Reset your Maths for All password',
    text: 'Reset your Maths for All password: ' + url
  });
}
