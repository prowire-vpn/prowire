import type {
  StateStore as IStateStore,
  StateStoreStoreCallback,
  StateStoreVerifyCallback,
  Metadata,
} from 'passport-oauth2';
import {type Request} from 'express';
import {StateAlreadyExistsError, StateNotFoundError} from './StateStore.error';

import {Injectable} from '@nestjs/common';
import {InjectRedis} from '@liaoliaots/nestjs-redis';
import {Redis} from 'ioredis';

const STATE_BASE_KEY = 'oauth:state:';

@Injectable()
export class StateStore implements IStateStore {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async addState(state: string, redirectUri: string): Promise<void> {
    await this.redis.set(STATE_BASE_KEY + state, redirectUri, 'EX', 60 * 5);
  }

  public async getState(state: string): Promise<string | null> {
    return this.redis.get(STATE_BASE_KEY + state);
  }

  public async removeState(state: string): Promise<void> {
    await this.redis.del(STATE_BASE_KEY + state);
  }

  public async store(req: Request, callback: StateStoreStoreCallback): Promise<void>;
  public async store(
    req: Request,
    meta: Metadata,
    callback: StateStoreStoreCallback,
  ): Promise<void>;
  public async store(
    req: Request,
    metaOrCallback: Metadata | StateStoreStoreCallback,
    callback?: StateStoreStoreCallback,
  ): Promise<void> {
    if (typeof metaOrCallback === 'function') {
      callback = metaOrCallback;
    }
    if (!callback) throw new Error('callback is required');
    const state = req.query.state as string;
    if (!state) throw new Error('state is required');
    const storedState = await this.getState(state);
    if (storedState) return callback(new StateAlreadyExistsError(state), state);
    await this.addState(state, '');
    callback(null, state);
  }

  public async verify(
    req: Request,
    state: string,
    callback: StateStoreVerifyCallback,
  ): Promise<void>;
  public async verify(
    req: Request,
    state: string,
    meta: Metadata,
    callback: StateStoreVerifyCallback,
  ): Promise<void>;
  public async verify(
    req: Request,
    state: string,
    metaOrCallback: Metadata | StateStoreVerifyCallback,
    callback?: StateStoreVerifyCallback,
  ): Promise<void> {
    if (typeof metaOrCallback === 'function') {
      callback = metaOrCallback;
    }
    if (!callback) throw new Error('callback is required');
    const redirectUri = await this.getState(state);
    if (!redirectUri) return callback(new StateNotFoundError(state), false, state);
    req.query.client_redirect_uri = redirectUri;
    await this.removeState(state);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    callback(null, true, state);
  }
}
