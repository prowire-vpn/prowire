import {Module, NestModule, MiddlewareConsumer, ValidationPipe} from '@nestjs/common';
import {ConfigSchema} from 'config';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthModule} from 'auth';
import {OrganizationModule} from 'organization';
import {MongooseModule} from '@nestjs/mongoose';
import cookieParser from 'cookie-parser';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {APP_PIPE} from '@nestjs/core';
import {ServerModule} from 'server';
import {LoggerMiddleware} from './logger.middleware';
import {HealthController} from './presentation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ConfigSchema,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_CONNECTION_STRING'),
        user: configService.get<string>('MONGO_USER'),
        pass: configService.get<string>('MONGO_PASSWORD'),
        dbName: configService.get<string>('MONGO_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    OrganizationModule,
    ServerModule,
  ],
  providers: [{provide: APP_PIPE, useValue: new ValidationPipe({transform: true})}],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
