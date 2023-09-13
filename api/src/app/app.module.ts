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
import {RedisModule} from '@liaoliaots/nestjs-redis';
import {LeaderService} from './domain';
import {LeaderRepository} from './infrastructure';
import {ScheduleModule} from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ConfigSchema,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_CONNECTION_STRING'),
        user: configService.get<string>('MONGO_USER'),
        pass: configService.get<string>('MONGO_PASSWORD'),
        dbName: configService.get<string>('MONGO_DATABASE'),
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    OrganizationModule,
    ServerModule,
  ],
  providers: [
    {provide: APP_PIPE, useValue: new ValidationPipe({transform: true})},
    LeaderRepository,
    LeaderService,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
