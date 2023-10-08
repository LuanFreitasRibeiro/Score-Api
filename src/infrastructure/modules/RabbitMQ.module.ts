import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CreateScoreUseCase from 'src/application/usecases/score/CreateScore.usecase';
import {
  RABBITMQ_CREATE_SCORE_EXCHANGE,
  RABBITMQ_PREFETCH,
  RABBITMQ_UPDATE_SCORE_EXCHANGE,
  RABBITMQ_URI,
} from 'src/commons/envs';
import MongooseScoreEntity, {
  MongooseScoreSchema,
} from '../database/repositories/mongoose/schemas/Score.schema';
import MongooseScoreRepositoryDatabase from '../database/repositories/mongoose/Score.repository';
import MongooseAssetRepositoryDatabase from '../database/repositories/mongoose/Asset.repository';
import MongooseUserRepositoryDatabase from '../database/repositories/mongoose/User.repository';
import MongooseAssetEntity, {
  MongooseAssetSchema,
} from '../database/repositories/mongoose/schemas/Asset.schema';
import MongooseDebtEntity, {
  MongooseDebtSchema,
} from '../database/repositories/mongoose/schemas/Debt.schema';
import MongooseUserEntity, {
  MongooseUserSchema,
} from '../database/repositories/mongoose/schemas/User.schema';
import ScoreConsumerController from '../rabbitmq/score/Score.consumer';
import ScoreProducerRabbitMQ from '../rabbitmq/score/Score.producer';
import UpdateScoreUseCase from 'src/application/usecases/score/UpdateScore.usecase';
import CalculateScoreUseCase from 'src/application/usecases/score/CalculateScore.usecase';
import MongooseDebtRepositoryDatabase from '../database/repositories/mongoose/Debt.repository';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: RABBITMQ_CREATE_SCORE_EXCHANGE,
          type: 'direct',
        },
        {
          name: RABBITMQ_UPDATE_SCORE_EXCHANGE,
          type: 'direct',
        },
      ],
      uri: RABBITMQ_URI,
      prefetchCount: RABBITMQ_PREFETCH,
      connectionInitOptions: { wait: true },
    }),
    MongooseModule.forFeature([
      {
        name: MongooseScoreEntity.name,
        schema: MongooseScoreSchema,
      },
      {
        name: MongooseDebtEntity.name,
        schema: MongooseDebtSchema,
      },
      {
        name: MongooseAssetEntity.name,
        schema: MongooseAssetSchema,
      },
      {
        name: MongooseUserEntity.name,
        schema: MongooseUserSchema,
      },
      {
        name: MongooseDebtEntity.name,
        schema: MongooseDebtSchema,
      },
    ]),
  ],
  providers: [
    ScoreProducerRabbitMQ,
    ScoreConsumerController,
    CreateScoreUseCase,
    CalculateScoreUseCase,
    UpdateScoreUseCase,
    {
      provide: 'ScoreRepository',
      useClass: MongooseScoreRepositoryDatabase,
    },
    {
      provide: 'AssetRepository',
      useClass: MongooseAssetRepositoryDatabase,
    },
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepositoryDatabase,
    },
    {
      provide: 'DebtRepository',
      useClass: MongooseDebtRepositoryDatabase,
    },
  ],
  exports: [RabbitMQModule],
})
export default class RabbitModule {}
