import {randomUUID} from 'crypto';
import {TestEnvironment} from 'jest-environment-node';
import {MongoMemoryServer} from 'mongodb-memory-server';

const mongo = new MongoMemoryServer();

declare global {
  let __MONGOD__: MongoMemoryServer;
  let __MONGO_URI__: string;
  let __MONGO_DB_NAME__: string;
}

export default class MongoEnvironment extends TestEnvironment {
  async setup() {
    await mongo.start();
    this.global.__MONGOD__ = mongo;
    this.global.__MONGO_URI__ = mongo.getUri();
    this.global.__MONGO_DB_NAME__ = randomUUID();
    await super.setup();
  }

  async teardown() {
    await mongo.stop();
    await super.teardown();
  }
}
