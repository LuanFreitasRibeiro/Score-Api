import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DefaultExceptionsFilter } from './commons/filters/default-exception.filter';
import AssetModule from './infrastructure/modules/Asset.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_URI } from './commons/envs';
import DebtModule from './infrastructure/modules/Debt.module';
import UserModule from './infrastructure/modules/User.module';
import ScoreModule from './infrastructure/modules/Score.module';

@Module({
  imports: [
    AssetModule,
    DebtModule,
    UserModule,
    ScoreModule,
    MongooseModule.forRoot(DATABASE_URI),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DefaultExceptionsFilter,
    },
  ],
})
export default class AppModule {}
