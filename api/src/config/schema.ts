import * as Joi from 'joi';
import {randomBytes} from 'crypto';

export const ConfigSchema = Joi.object({
  API_URL: Joi.string().uri().required(),
  ADMIN_PANEL_URL: Joi.string().uri().required(),
  API_PORT: Joi.number().default(54844),
  API_UNSECURE_PORT: Joi.number(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  SERVER_ID: Joi.string().default('prowire'),
  ACCESS_TOKEN_EXPIRATION: Joi.string().default('1h'),
  ACCESS_TOKEN_SECRET: Joi.string().default(randomBytes(32).toString('base64')),
  REFRESH_TOKEN_KEY_BASE64: Joi.string().default(randomBytes(32).toString('base64')),
  CORS_ORIGIN: Joi.string().default('*'),
  VPN_SERVER_SECRET: Joi.string().required(),
  CA_CERTIFICATE: Joi.string().required(),
  CA_PRIVATE_KEY: Joi.string().required(),
  MONGO_CONNECTION_STRING: Joi.string().required(),
  MONGO_USER: Joi.string(),
  MONGO_PASSWORD: Joi.string(),
  MONGO_DATABASE: Joi.string(),
  SERVER_PRIVATE_KEY: Joi.string(),
  SERVER_CERTIFICATE: Joi.string(),
  SESSION_SECRET: Joi.string(),
});
