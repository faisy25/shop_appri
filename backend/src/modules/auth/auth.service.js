import dbHelper from '../../util/database/dbHelper.js';
import ApiError from '../../util/error/api.error.js';
import { ServiceError } from '../../util/error/service.error.js';
import { comparePassword, hashPassword } from '../../util/user/userHelpers.js';
import { userService } from '../rba/user/user.service.js';
import {
  JWT_CONFIG,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../config/auth/jwt.js';

const nowPlusSeconds = (seconds) => new Date(Date.now() + seconds * 1000);
const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');
const isBcryptHash = (value) => typeof value === 'string' && value.startsWith('$2');

export const authService = {
  async login({ email, password, ip = null, user_agent = null }) {
    try {
      const normalizedEmail = normalizeEmail(email);
      if (!normalizedEmail) throw new ApiError(400, 'Email is required');

      const userRow = await dbHelper.getOne({
        table: 'user',
        selectColumns: ['user_id', 'uuid', 'name', 'email', 'password', 'is_active'],
        where: { email: normalizedEmail },
        deletedColumn: 'is_deleted',
      });

      if (!userRow) throw new ApiError(401, 'Invalid email or password', `User not found for email ${normalizedEmail}`);
      if (userRow.is_active !== 1) throw new ApiError(403, 'User is inactive');

      // Support legacy/plaintext passwords in non-production and auto-upgrade to bcrypt
      let ok = false;
      if (isBcryptHash(userRow.password)) {
        ok = await comparePassword(password, userRow.password);
      } else {
        const allowPlain = process.env.NODE_ENV !== 'production';
        ok = allowPlain && String(password) === String(userRow.password);
        if (ok) {
          const upgraded = await hashPassword(String(password));
          await dbHelper.updateOne('user', { password: upgraded }, { user_id: userRow.user_id });
        }
      }

      if (!ok) throw new ApiError(401, 'Invalid email or password', 'Password mismatch');

      const access_token = signAccessToken({
        user_id: userRow.user_id,
        uuid: userRow.uuid,
        email: userRow.email,
      });
      const refresh_token = signRefreshToken({ user_id: userRow.user_id });
      const refresh_expires_at = nowPlusSeconds(JWT_CONFIG.refreshExpiresInSeconds);

      // Return user + permissions using existing service
      const user = await userService.getById(userRow.user_id);

      return {
        user,
        tokens: {
          access_token,
          refresh_token,
          refresh_expires_at,
        },
      };
    } catch (err) {
      ServiceError(err, 'Failed to login');
    }
  },

  async refresh({ refresh_token }) {
    try {
      if (!refresh_token) throw new ApiError(401, 'Missing refresh token');
      const payload = verifyRefreshToken(refresh_token);
      const user_id = Number(payload.sub);

      // Need uuid/email for access token
      const userRow = await dbHelper.getOne({
        table: 'user',
        selectColumns: ['user_id', 'uuid', 'email', 'is_active'],
        where: { user_id },
        deletedColumn: 'is_deleted',
      });
      if (!userRow) throw new ApiError(401, 'User not found');
      if (userRow.is_active !== 1) throw new ApiError(403, 'User is inactive');

      const access_token = signAccessToken({
        user_id: userRow.user_id,
        uuid: userRow.uuid,
        email: userRow.email,
      });
      // Stateless rotation: issue a new refresh token (old one remains valid until it expires)
      const new_refresh_token = signRefreshToken({ user_id });
      const refresh_expires_at = nowPlusSeconds(JWT_CONFIG.refreshExpiresInSeconds);

      return {
        access_token,
        refresh_token: new_refresh_token,
        refresh_expires_at,
      };
    } catch (err) {
      ServiceError(err, 'Failed to refresh token');
    }
  },

  async logout({ refresh_token }) {
    try {
      // Stateless logout: server cannot revoke JWT without storage.
      // Controller will clear cookie in browser. This method remains idempotent.
      if (refresh_token) {
        verifyRefreshToken(refresh_token);
      }
      return true;
    } catch (err) {
      ServiceError(err, 'Failed to logout');
    }
  },
};

