import jwt from 'jsonwebtoken';
import ApiError from '../../util/error/api.error.js';
import crypto from 'crypto';

const mustGetEnv = (key) => {
  const v = process.env[key];
  if (!v) throw new ApiError(500, `Missing env ${key}`);
  return v;
};

const getAccessSecret = () => mustGetEnv('JWT_ACCESS_SECRET');
const getRefreshSecret = () => mustGetEnv('JWT_REFRESH_SECRET');

const parseExpirySeconds = (value, fallbackSeconds) => {
  if (!value) return fallbackSeconds;
  const asNum = Number(value);
  if (!Number.isFinite(asNum) || asNum <= 0) return fallbackSeconds;
  return Math.floor(asNum);
};

export const JWT_CONFIG = {
  accessExpiresInSeconds: parseExpirySeconds(process.env.JWT_ACCESS_EXPIRES_IN, 15 * 60), // 15m
  refreshExpiresInSeconds: parseExpirySeconds(process.env.JWT_REFRESH_EXPIRES_IN, 30 * 24 * 60 * 60), // 30d
};

export const signAccessToken = ({ user_id, uuid, email }) => {
  const secret = getAccessSecret();
  return jwt.sign(
    { sub: String(user_id), uuid, email, type: 'access' },
    secret,
    { expiresIn: JWT_CONFIG.accessExpiresInSeconds },
  );
};

export const signRefreshToken = ({ user_id, token_id }) => {
  const secret = getRefreshSecret();
  const jti = token_id || crypto.randomUUID().replace(/-/g, '');
  return jwt.sign(
    { sub: String(user_id), jti, type: 'refresh' },
    secret,
    { expiresIn: JWT_CONFIG.refreshExpiresInSeconds },
  );
};

export const verifyAccessToken = (token) => {
  try {
    const secret = getAccessSecret();
    const payload = jwt.verify(token, secret);
    if (!payload || payload.type !== 'access') throw new Error('Invalid token type');
    return payload;
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired access token', err.message);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const secret = getRefreshSecret();
    const payload = jwt.verify(token, secret);
    if (!payload || payload.type !== 'refresh') throw new Error('Invalid token type');
    return payload;
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token', err.message);
  }
};

