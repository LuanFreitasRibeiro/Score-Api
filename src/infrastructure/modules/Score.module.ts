import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseScoreEntity, {
  MongooseScoreSchema,
} from '../database/repositories/mongoose/schemas/Score.schema';
import CreateScoreUseCase from 'src/application/usecases/score/CreateScore.usecase';
import GetScoreByIdUseCase from 'src/application/usecases/score/GetScoreById.usecase';
import GetScoreByUserIdUseCase from 'src/application/usecases/score/GetScoreByUserId.usecase';
import MongooseScoreRepositoryDatabase from '../database/repositories/mongoose/Score.repository';
import MongooseDebtRepositoryDatabase from '../database/repositories/mongoose/Debt.repository';
import MongooseAssetRepositoryDatabase from '../database/repositories/mongoose/Asset.repository';
import CalculateScoreUseCase from 'src/application/usecases/score/CalculateScore.usecase';
import MongooseDebtEntity, {
  MongooseDebtSchema,
} from '../database/repositories/mongoose/schemas/Debt.schema';
import MongooseAssetEntity, {
  MongooseAssetSchema,
} from '../database/repositories/mongoose/schemas/Asset.schema';
import ScoreController from 'src/presentation/controllers/Score.controller';
import MongooseUserEntity, {
  MongooseUserSchema,
} from '../database/repositories/mongoose/schemas/User.schema';
import MongooseUserRepositoryDatabase from '../database/repositories/mongoose/User.repository';
import ScoreConsumerController from '../rabbitmq/score/Score.consumer';
import UpdateScoreUseCase from 'src/application/usecases/score/UpdateScore.usecase';

@Module({
  imports: [
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
    ]),
  ],
  providers: [
    CreateScoreUseCase,
    GetScoreByIdUseCase,
    GetScoreByUserIdUseCase,
    CalculateScoreUseCase,
    UpdateScoreUseCase,
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
      provide: 'UserRepository',
      useClass: MongooseUserRepositoryDatabase,
    },
  ],
  controllers: [ScoreController, ScoreConsumerController],
})
export default class ScoreModule {}
