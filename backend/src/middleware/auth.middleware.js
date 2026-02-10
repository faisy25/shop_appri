import ApiError from '../util/error/api.error.js';
import { asyncHandler } from './async.middlleware.js';
import { verifyAccessToken } from '../config/auth/jwt.js';
import { userService } from '../modules/rba/user/user.service.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
};

/**
 * Require valid access token and attach:
 * - req.auth: JWT payload
 * - req.user: full user + roles + permissions + user_access
 */
export const requireAuth = asyncHandler(async (req, _res, _next) => {
  const token = getBearerToken(req);
  if (!token) throw new ApiError(401, 'Missing Authorization Bearer token');

  const payload = verifyAccessToken(token);
  req.auth = payload;

  const userId = Number(payload.sub);
  if (!userId) throw new ApiError(401, 'Invalid token subject');

  const user = await userService.getById(userId);
  if (!user) throw new ApiError(401, 'User not found');

  req.user = user;
});

/**
 * Permission guard (expects requireAuth to run before it).
 * Usage: router.get('/x', requireAuth, requirePermission('PERMISSION_NAME'), handler)
 */
export const requirePermission = (permissionName) =>
  asyncHandler(async (req, _res, _next) => {
    if (!req.user) throw new ApiError(401, 'Unauthorized');
    const permissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    const has = permissions.some((p) => p.permission_name === permissionName || p.name === permissionName);
    if (!has) throw new ApiError(403, 'Forbidden');
  });

