import { asyncHandler } from '../../middleware/async.middlleware.js';
import { success } from '../../util/responses.js';
import { authService } from './auth.service.js';
import { JWT_CONFIG } from '../../config/auth/jwt.js';

const REFRESH_COOKIE_NAME = process.env.AUTH_REFRESH_COOKIE_NAME || 'refresh_token';

const getCookie = (req, name) => {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const parts = raw.split(';').map((p) => p.trim());
  const hit = parts.find((p) => p.startsWith(`${name}=`));
  if (!hit) return null;
  return decodeURIComponent(hit.substring(name.length + 1));
};

const getRefreshTokenFromReq = (req) => {
  return req.body?.refresh_token || getCookie(req, REFRESH_COOKIE_NAME) || null;
};

const refreshCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite = process.env.AUTH_COOKIE_SAMESITE || (isProd ? 'none' : 'lax');
  const secure = process.env.AUTH_COOKIE_SECURE
    ? process.env.AUTH_COOKIE_SECURE === 'true'
    : isProd;

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/api/auth',
    maxAge: JWT_CONFIG.refreshExpiresInSeconds * 1000,
  };
};

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login({
    email: req.body.email,
    password: req.body.password,
    ip: req.ip,
    user_agent: req.get('user-agent') || null,
  });
  // Store refresh token in HttpOnly cookie (browser/Chrome)
  if (data?.tokens?.refresh_token) {
    res.cookie(REFRESH_COOKIE_NAME, data.tokens.refresh_token, refreshCookieOptions());
  }
  return success(res, 'Login successful', data, 200);
});

export const refresh = asyncHandler(async (req, res) => {
  const refresh_token = getRefreshTokenFromReq(req);
  const tokens = await authService.refresh({ refresh_token });
  // Rotate cookie
  if (tokens?.refresh_token) {
    res.cookie(REFRESH_COOKIE_NAME, tokens.refresh_token, refreshCookieOptions());
  }
  return success(res, 'Token refreshed', tokens, 200);
});

export const logout = asyncHandler(async (req, res) => {
  const refresh_token = getRefreshTokenFromReq(req);
  await authService.logout({ refresh_token });
  // Clear refresh cookie
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
  return success(res, 'Logged out', true, 200);
});

export const me = asyncHandler(async (req, res) => {
  // populated by requireAuth middleware
  return success(res, 'Me', req.user, 200);
});

