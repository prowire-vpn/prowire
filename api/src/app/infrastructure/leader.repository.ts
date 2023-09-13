import {Injectable} from '@nestjs/common';
import {InjectRedis} from '@liaoliaots/nestjs-redis';
import {Redis} from 'ioredis';

const LOCK_KEY = 'leader';

@Injectable()
export class LeaderRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getCurrentLeader(): Promise<string | null> {
    return this.redis.get(LOCK_KEY);
  }

  async attemptTakeLock(identifier: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.redis.set(LOCK_KEY, identifier, 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  async renewLock(identifier: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.redis.set(LOCK_KEY, identifier, 'EX', ttlSeconds, 'XX');
    return result === 'OK';
  }
}
