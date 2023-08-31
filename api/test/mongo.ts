import {MongooseModule, MongooseModuleOptions} from '@nestjs/mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {model} from 'mongoose';
import {UserSchema} from 'organization/infrastructure';

export const userModel = model('User', UserSchema);

export let mongod: MongoMemoryServer;

export async function startMongo(options?: MongooseModuleOptions) {
  mongod = await MongoMemoryServer.create();
  const mongoImport = MongooseModule.forRoot(mongod.getUri(), options);
  return {mongod, mongoImport};
}

export async function stopMongo() {
  if (mongod) await mongod.stop();
}
