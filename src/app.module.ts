import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DefaultExceptionsFilter } from './commons/filters/default-exception.filter';
import AssetModule from './infrastructure/modules/Asset.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_URI } from './commons/envs';
import DebtModule from './infrastructure/modules/Debt.module';
import UserModule from './infrastructure/modules/User.module';
import ScoreModule from './infrastructure/modules/Score.module';
import QueueConsumerModule from './infrastructure/modules/QueueConsumer.module';
import RabbitMQProducerModule from './infrastructure/modules/RabbitMQProducer.module';

@Module({
  imports: [
    RabbitMQProducerModule,
    AssetModule,
    DebtModule,
    UserModule,
    ScoreModule,
    QueueConsumerModule,
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
