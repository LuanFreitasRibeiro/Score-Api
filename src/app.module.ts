import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DefaultExceptionsFilter } from './commons/filters/default-exception.filter';
import AssetModule from './infrastructure/modules/Asset.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_URI, EXPIRATION_TIME_IN_SEGS } from './commons/envs';
import DebtModule from './infrastructure/modules/Debt.module';
import UserModule from './infrastructure/modules/User.module';
import ScoreModule from './infrastructure/modules/Score.module';
import AuthModule from './infrastructure/modules/Auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import RabbitModule from './infrastructure/modules/RabbitMQ.module';

@Module({
  imports: [
    AssetModule,
    DebtModule,
    UserModule,
    ScoreModule,
    AuthModule,
    MongooseModule.forRoot(DATABASE_URI),
    CacheModule.register({ ttl: EXPIRATION_TIME_IN_SEGS, isGlobal: true }),
    RabbitModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DefaultExceptionsFilter,
    },
  ],
})
export default class AppModule {}
