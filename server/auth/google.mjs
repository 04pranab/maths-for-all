import { google } from 'googleapis';
import { randomToken } from './crypto.mjs';
import { config } from './config.mjs';

const SCOPES = ['openid', 'email', 'profile'];

function configured() {
  return Boolean(config.googleClientId && config.googleClientSecret && config.googleRedirectUri);
}

function client() {
  if (!configured()) throw new Error('Google sign-in is not configured.');
  return new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleRedirectUri
  );
}

export function createState() {
  return randomToken(32);
}

export function authorizationUrl(state) {
  const oauth = client();
  return oauth.generateAuthUrl({
    access_type: 'online',
    scope: SCOPES,
    state,
    prompt: 'select_account'
  });
}

export async function verifyCallback(code) {
  const oauth = client();
  const { tokens } = await oauth.getToken(code);

  if (!tokens.id_token) throw new Error('Google did not return an identity token.');

  const ticket = await oauth.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.googleClientId
  });
  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    throw new Error('Google account email verification is required.');
  }

  return {
    subject: payload.sub,
    email: String(payload.email).trim().toLowerCase(),
    name: typeof payload.name === 'string' ? payload.name : ''
  };
}

export function isConfigured() {
  return configured();
}
