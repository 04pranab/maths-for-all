import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, createHash, timingSafeEqual } from 'node:crypto';

const SCRYPT_N = 2 ** 17;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const MAXMEM = 256 * 1024 * 1024;
const scrypt = promisify(scryptCallback);

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function hashToken(token) {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH, {
    N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: MAXMEM
  });
  return 'scrypt-N' + SCRYPT_N + '-r' + SCRYPT_R + '-p' + SCRYPT_P + '$' +
    salt.toString('base64url') + '$' + Buffer.from(derived).toString('base64url');
}

export async function verifyPassword(password, encoded) {
  const match = /^scrypt-N(\\d+)-r(\\d+)-p(\\d+)\\$([^$]+)\\$([^$]+)$/.exec(encoded || '');
  if (!match) return false;
  const [, nText, rText, pText, saltText, digestText] = match;
  const n = Number(nText);
  const blockSize = Number(rText);
  const parallelization = Number(pText);
  if (![n, blockSize, parallelization].every(Number.isSafeInteger)) return false;
  const salt = Buffer.from(saltText, 'base64url');
  const expected = Buffer.from(digestText, 'base64url');
  const actual = Buffer.from(await scrypt(password, salt, expected.length, {
    N: n, r: blockSize, p: parallelization, maxmem: MAXMEM
  }));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function validUsername(value) {
  return /^[a-z0-9_]{3,30}$/.test(value);
}

export function validEmail(value) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}

export function validPassword(value) {
  return typeof value === 'string' && value.length >= 8 && value.length <= 128;
}
