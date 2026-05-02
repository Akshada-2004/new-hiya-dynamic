import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_SESSION_COOKIE = 'hiya_admin_session';
export const ADMIN_LOGIN_PATH = '/admin/login';
export const ADMIN_DEFAULT_PATH = '/admin/dashboard';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function readEnv(name) {
  return process.env[name]?.trim() ?? '';
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function hashPassword(password, salt) {
  return scryptSync(String(password), salt, 64).toString('hex');
}

function signPayload(encodedPayload) {
  const secret = readEnv('ADMIN_SESSION_SECRET');

  if (!secret) {
    return '';
  }

  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function serializeSessionToken(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = signPayload(encodedPayload);

  if (!signature) {
    return '';
  }

  return `${encodedPayload}.${signature}`;
}

function parseSessionToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);

  if (!expectedSignature || !safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    if (typeof payload.userId !== 'string' || typeof payload.exp !== 'number') {
      return null;
    }

    if (payload.exp <= Date.now()) {
      return null;
    }

    const configuredUserId = readEnv('ADMIN_USER_ID');

    if (!configuredUserId || !safeCompare(payload.userId, configuredUserId)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAdminAuthConfigError() {
  if (!readEnv('ADMIN_USER_ID')) {
    return 'Missing ADMIN_USER_ID in server configuration.';
  }

  if (!readEnv('ADMIN_PASSWORD_HASH')) {
    return 'Missing ADMIN_PASSWORD_HASH in server configuration.';
  }

  if (!readEnv('ADMIN_PASSWORD_SALT')) {
    return 'Missing ADMIN_PASSWORD_SALT in server configuration.';
  }

  if (!readEnv('ADMIN_SESSION_SECRET')) {
    return 'Missing ADMIN_SESSION_SECRET in server configuration.';
  }

  return null;
}

export function verifyAdminCredentials(userId, password) {
  const configError = getAdminAuthConfigError();

  if (configError) {
    return { ok: false, error: configError };
  }

  const expectedUserId = readEnv('ADMIN_USER_ID');
  const expectedPasswordHash = readEnv('ADMIN_PASSWORD_HASH');
  const passwordSalt = readEnv('ADMIN_PASSWORD_SALT');
  const providedPasswordHash = hashPassword(password, passwordSalt);

  const isValid =
    safeCompare(userId, expectedUserId) &&
    safeCompare(providedPasswordHash, expectedPasswordHash);

  if (!isValid) {
    return { ok: false, error: 'Invalid user ID or password.' };
  }

  return { ok: true, error: null };
}

export async function createAdminSession(userId) {
  const token = serializeSessionToken({
    userId,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });

  if (!token) {
    throw new Error('Unable to create admin session token.');
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSessionFromCookies() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return parseSessionToken(token);
}

export function getAdminSessionFromRequest(request) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return parseSessionToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSessionFromCookies();

  if (!session) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return session;
}

export function getSafeAdminNextPath(nextPath) {
  if (
    typeof nextPath !== 'string' ||
    nextPath === '/admin' ||
    !nextPath.startsWith('/admin') ||
    nextPath.startsWith('/admin/login')
  ) {
    return ADMIN_DEFAULT_PATH;
  }

  return nextPath;
}

export function buildAdminPasswordHash(password) {
  const passwordSalt = readEnv('ADMIN_PASSWORD_SALT');

  if (!passwordSalt) {
    throw new Error('Missing ADMIN_PASSWORD_SALT in server configuration.');
  }

  return hashPassword(password, passwordSalt);
}
