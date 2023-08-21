import {NestFactory} from '@nestjs/core';
import {AppModule} from 'app/app.module';
import {ExpressAdapter, NestExpressApplication} from '@nestjs/platform-express';
import {WsAdapter} from '@nestjs/platform-ws';
import {ConfigService} from '@nestjs/config';
import {readFile} from 'fs/promises';
import express, {Express} from 'express';
import https, {ServerOptions} from 'https';
import http from 'http';
import {Logger} from '@nestjs/common';

/** This is the main execution file to run the program */

const logger = new Logger('main');

run();

async function run() {
  logger.log('Entering initialization phase');
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGIN').split(','),
    credentials: true,
  });
  // Return null for all undefined values in response
  app.set('json replacer', (key: unknown, val: unknown) => (val === undefined ? null : val));

  // Create all the node http servers needed
  const hasSecureConfig =
    configService.get('SERVER_CERTIFICATE') && configService.get('SERVER_PRIVATE_KEY');
  const prepareServer = hasSecureConfig ? prepareSecureServer : prepareUnsecureServer;
  const servers = await prepareServer(server, app);

  // WebSockets must be added on each server individually
  servers.forEach(({server}) => {
    app.useWebSocketAdapter(new WsAdapter(server));
  });

  await app.init();
  logger.log('App initialized, entering server binding phase');

  await Promise.all(
    servers.map(
      ({server, port, secure}) =>
        new Promise<void>((resolve) => {
          server.listen(port, () => {
            logger.log(`Listening over HTTP${secure ? 'S' : ''} on port ${port}`);
            resolve();
          });
        }),
    ),
  );
  logger.log('App fully bound to server, ready to receive connections');
}

interface ServerAndPort {
  port: number;
  server: http.Server | https.Server;
  secure: boolean;
}

async function prepareSecureServer(
  server: Express,
  app: NestExpressApplication,
): Promise<Array<ServerAndPort>> {
  const configService = app.get(ConfigService);
  const privateKeyPath = configService.getOrThrow<string>('SERVER_PRIVATE_KEY');
  const certificatePath = configService.getOrThrow<string>('SERVER_CERTIFICATE');
  const port = configService.getOrThrow<number>('API_PORT');
  const key = await readFile(privateKeyPath);
  const cert = await readFile(certificatePath);
  const options: ServerOptions = {key, cert};
  const servers: Array<ServerAndPort> = [
    {server: https.createServer(options, server), port, secure: true},
  ];
  const unsecurePort = configService.get<number>('API_UNSECURE_PORT');
  if (unsecurePort) servers.push(...prepareUnsecureServer(server, app, unsecurePort));
  return servers;
}

function prepareUnsecureServer(
  server: Express,
  app: NestExpressApplication,
  portOverride?: number,
): Array<ServerAndPort> {
  const configService = app.get(ConfigService);
  const port = portOverride ?? configService.getOrThrow<number>('API_PORT');
  return [{server: http.createServer(server), port, secure: false}];
}
