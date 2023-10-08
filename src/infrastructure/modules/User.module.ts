import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseUserEntity, {
  MongooseUserSchema,
} from '../database/repositories/mongoose/schemas/User.schema';
import CreateUserUseCase from 'src/application/usecases/user/CreateUser.usecase';
import MongooseUserRepositoryDatabase from '../database/repositories/mongoose/User.repository';
import UserController from 'src/presentation/controllers/User.controller';
import GetUserByEmailUseCase from 'src/application/usecases/user/GetUserByEmail.usecase';
import GetUserByIdUseCase from 'src/application/usecases/user/GetUserById.usecase';
import RabbitModule from './RabbitMQ.module';
import ScoreProducerRabbitMQ from '../rabbitmq/score/Score.producer';
import CalculateScoreUseCase from 'src/application/usecases/score/CalculateScore.usecase';
import UpdateScoreUseCase from 'src/application/usecases/score/UpdateScore.usecase';
import MongooseScoreRepositoryDatabase from '../database/repositories/mongoose/Score.repository';
import MongooseDebtRepositoryDatabase from '../database/repositories/mongoose/Debt.repository';
import MongooseAssetRepositoryDatabase from '../database/repositories/mongoose/Asset.repository';
import MongooseAssetEntity, {
  MongooseAssetSchema,
} from '../database/repositories/mongoose/schemas/Asset.schema';
import MongooseDebtEntity, {
  MongooseDebtSchema,
} from '../database/repositories/mongoose/schemas/Debt.schema';
import MongooseScoreEntity, {
  MongooseScoreSchema,
} from '../database/repositories/mongoose/schemas/Score.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongooseUserEntity.name,
        schema: MongooseUserSchema,
      },
      {
        name: MongooseAssetEntity.name,
        schema: MongooseAssetSchema,
      },
      {
        name: MongooseDebtEntity.name,
        schema: MongooseDebtSchema,
      },
      {
        name: MongooseScoreEntity.name,
        schema: MongooseScoreSchema,
      },
    ]),
    RabbitModule,
  ],
  providers: [
    CreateUserUseCase,
    GetUserByEmailUseCase,
    GetUserByIdUseCase,
    ScoreProducerRabbitMQ,
    CalculateScoreUseCase,
    UpdateScoreUseCase,
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepositoryDatabase,
    },
    {
      provide: 'ScoreRepository',
      useClass: MongooseScoreRepositoryDatabase,
    },
    {
      provide: 'DebtRepository',
      useClass: MongooseDebtRepositoryDatabase,
    },
    {
      provide: 'AssetRepository',
      useClass: MongooseAssetRepositoryDatabase,
    },
    {
      provide: 'ScoreProducer',
      useClass: ScoreProducerRabbitMQ,
    },
  ],
  controllers: [UserController],
})
export default class UserModule {}
