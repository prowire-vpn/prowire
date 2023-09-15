import {faker} from '@faker-js/faker';
import {randomBytes} from 'crypto';

process.env = {
  API_URL: faker.internet.url(),
  ADMIN_PANEL_URL: faker.internet.url(),
  MONGO_CONNECTION_STRING: faker.internet.url(),
  AUTHORIZED_REDIRECT_URIS: `${faker.internet.url()},${faker.internet.url()}`,
  GOOGLE_CLIENT_ID: faker.datatype.uuid(),
  GOOGLE_CLIENT_SECRET: faker.datatype.uuid(),
  SERVER_ID: faker.datatype.uuid(),
  ACCESS_TOKEN_SECRET: faker.datatype.uuid(),
  REFRESH_TOKEN_KEY_BASE64: randomBytes(32).toString('base64'),
  VPN_SERVER_SECRET: faker.datatype.uuid(),
  CA_CERTIFICATE: faker.system.filePath(),
  CA_PRIVATE_KEY: faker.system.filePath(),
  REDIS_HOST: faker.internet.ip(),
};
