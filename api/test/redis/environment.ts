import {RedisMemoryServer} from 'redis-memory-server';
import MongoEnvironment from '../mongo/environment';

const redis = new RedisMemoryServer();

declare global {
  let __REDIS__: RedisMemoryServer;
  let __REDIS_HOST__: string;
  let __REDIS_PORT__: string;
}

export default class RedisEnvironment extends MongoEnvironment {
  async setup() {
    await redis.start();
    this.global.__REDIS__ = redis;
    this.global.__REDIS_HOST__ = await redis.getHost();
    this.global.__REDIS_PORT__ = await redis.getPort();
    await super.setup();
  }

  async teardown() {
    await redis.stop();
    await super.teardown();
  }
}
