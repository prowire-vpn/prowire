import {userFactory} from './user/user';
import {clientFactory, accessTokenFactory, refreshTokenFactory, oauthSessionFactory} from './auth';
import {vpnConfigFactory, vpnSessionFactory} from './server';

const factoryMap = {
  user: userFactory,
  client: clientFactory,
  accessToken: accessTokenFactory,
  refreshToken: refreshTokenFactory,
  vpnConfig: vpnConfigFactory,
  vpnSession: vpnSessionFactory,
  oauthSession: oauthSessionFactory,
};
type EntityName = keyof typeof factoryMap;
type EntityFactory<T extends EntityName> = (typeof factoryMap)[T];
type Entity<T extends EntityName> = Awaited<ReturnType<EntityFactory<T>['build']>>;
type EntityBuildArgs<T extends EntityName> = Parameters<EntityFactory<T>['build']>;

export function build<T extends EntityName>(name: T, ...args: EntityBuildArgs<T>): Entity<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return factoryMap[name].build(...args);
}

export function buildMany<T extends EntityName>(
  name: T,
  count: number,
  ...args: EntityBuildArgs<T>
) {
  return Array(count)
    .fill(0)
    .map(() => build(name, ...args));
}

export async function create<T extends EntityName>(
  name: T,
  ...args: EntityBuildArgs<T>
): Promise<Entity<T>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await factoryMap[name].persist(build(name, ...args));
}

export async function createMany<T extends EntityName>(
  name: T,
  count: number,
  ...args: EntityBuildArgs<T>
): Promise<Array<Entity<T>>> {
  return await Promise.all(
    Array(count)
      .fill(0)
      .map(() => create(name, ...args)),
  );
}
