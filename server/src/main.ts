import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ShutdownService} from './lifecycle/shutdown.service';
import {ConfigService} from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Return null for all undefined values in response
  app.set('json replacer', (key: unknown, val: unknown) => (val === undefined ? null : val));
  // Allow using shutdown hook
  app.enableShutdownHooks();
  // Subscribe to your service's shutdown event, run app.close() when emitted
  app.get(ShutdownService).subscribeToShutdown(() => app.close());
  const port = app.get(ConfigService).getOrThrow<number>('VPN_SERVER_PORT');
  await app.listen(port);
}

// Check that the program is run with root privilege. This is required for OpenVPN process
const uid = process.getuid?.();
if (uid !== 0) {
  console.error(`Process not running as root ${uid}`);
  process.exit(1);
}

bootstrap();
