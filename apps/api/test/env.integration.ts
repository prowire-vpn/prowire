import {faker} from '@faker-js/faker';
import './env';

process.env = {
  API_URL: faker.internet.url(),
  MONGO_CONNECTION_STRING: 'mongodb://root:change_me@localhost:27017/',
  CA_CERTIFICATE: '../../certs/ca.crt',
  CA_PRIVATE_KEY: '../../certs/ca.key',
  REDIS_HOST: 'localhost',
};
