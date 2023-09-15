import {Redis} from 'ioredis';

process.env.REDIS_HOST = __REDIS_HOST__;
process.env.REDIS_PORT = __REDIS_PORT__;

afterEach(async () => {
  const redis = new Redis({
    host: __REDIS_HOST__,
    port: parseInt(__REDIS_PORT__),
  });
  await redis.flushall();
  await redis.quit();
});
export {};
