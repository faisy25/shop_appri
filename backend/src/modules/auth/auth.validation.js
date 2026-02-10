import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().max(150).trim().lowercase().required(),
  password: Joi.string().min(1).required(),
});

export const refreshSchema = Joi.object({
  // If using HttpOnly cookie, body may be empty
  refresh_token: Joi.string().optional(),
});

export const logoutSchema = Joi.object({
  // If using HttpOnly cookie, body may be empty
  refresh_token: Joi.string().optional(),
});

