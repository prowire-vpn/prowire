import * as BaseJoi from 'joi';
import validator from 'validator';
import {randomBytes} from 'crypto';

interface ICustomStringSchema<TSchema = string> extends BaseJoi.StringSchema<TSchema> {
  uriList(): ICustomStringSchema;
}

interface ICustomJoi extends BaseJoi.Root {
  string<TSchema = string>(): ICustomStringSchema<TSchema>;
  uriList(): ICustomStringSchema;
}

const Joi = BaseJoi.extend({
  type: 'uriList',
  messages: {
    'urlList.string': '{{#label}} must be comma delimited list or URLs [a string was not provided]',
    'urlList.url':
      '{{#label}} must be comma delimited list or URLs [some elements are not valid URLs]',
  },
  validate(value: string, helpers) {
    if (typeof value !== 'string') return {value, errors: helpers.error('urlList.string')};
    const urls = value.split(',');
    if (
      !urls.every((url) =>
        validator.isURL(url, {
          require_tld: false,
          require_valid_protocol: false,
          require_host: false,
        }),
      )
    ) {
      return {value: urls, errors: helpers.error('urlList.url')};
    }
    return {value: urls};
  },
}) as ICustomJoi;

export const ConfigSchema = Joi.object({
  API_URL: Joi.string().uri().required(),
  API_PORT: Joi.number().default(54844),
  API_UNSECURE_PORT: Joi.number(),
  AUTHORIZED_REDIRECT_URIS: Joi.uriList().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  SERVER_ID: Joi.string().default('prowire'),
  ACCESS_TOKEN_EXPIRATION: Joi.string().default('1h'),
  ACCESS_TOKEN_SECRET: Joi.string().default(randomBytes(32).toString('base64')),
  REFRESH_TOKEN_KEY_BASE64: Joi.string().default(randomBytes(32).toString('base64')),
  VPN_SERVER_SECRET: Joi.string().required(),
  CA_CERTIFICATE: Joi.string().required(),
  CA_PRIVATE_KEY: Joi.string().required(),
  MONGO_CONNECTION_STRING: Joi.string().required(),
  MONGO_USER: Joi.string(),
  MONGO_PASSWORD: Joi.string(),
  MONGO_DATABASE: Joi.string(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string(),
  SERVER_PRIVATE_KEY: Joi.string(),
  SERVER_CERTIFICATE: Joi.string(),
  SESSION_SECRET: Joi.string(),
});
