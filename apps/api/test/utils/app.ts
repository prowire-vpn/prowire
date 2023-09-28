import {Test} from '@nestjs/testing';
import {AppModule} from 'app/app.module';
import {TestingModule} from '@nestjs/testing';
import {type INestApplication} from '@nestjs/common';

export interface CreateAppResult {
  app: INestApplication;
  module: TestingModule;
  httpServer: any;
}

let cachedResult: CreateAppResult | undefined;

export async function createApp(): Promise<CreateAppResult> {
  if (cachedResult) return cachedResult;
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  await app.init();
  cachedResult = {app, module, httpServer: app.getHttpServer()};
  return cachedResult;
}

export async function closeApp(): Promise<void> {
  if (!cachedResult) return;
  await cachedResult.app.close();
  cachedResult = undefined;
}
