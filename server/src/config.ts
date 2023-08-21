import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  API_URL: Joi.string().uri().required(),
  VPN_SERVER_SECRET: Joi.string().required(),
  VPN_SERVER_ID: Joi.string(),
  VPN_SERVER_DH_PARAM: Joi.string().required(),
  VPN_SERVER_PUBLIC_URL: Joi.string().uri(),
  VPN_SERVER_PORT: Joi.number().default(1194),
});
