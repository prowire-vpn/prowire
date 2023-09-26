import {testEnv} from './env';

process.env = {
  ...testEnv,
  MONGO_CONNECTION_STRING: 'mongodb://root:change_me@localhost:27017/',
  CA_CERTIFICATE: '../../certs/ca.crt',
  CA_PRIVATE_KEY: '../../certs/ca.key',
  REDIS_HOST: 'localhost',
};
