import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CreateAssetUseCase from 'src/application/usecases/asset/CreateAsset.usecase';
import AssetController from 'src/presentation/controllers/Asset.controller';
import MongooseAssetEntity, {
  MongooseAssetSchema,
} from '../database/repositories/mongoose/schemas/Asset.schema';
import MongooseAssetRepositoryDatabase from '../database/repositories/mongoose/Asset.repository';
import GetByIdUseCase from 'src/application/usecases/asset/GetAssetById.usecase';
import UpdateAssetUseCase from 'src/application/usecases/asset/UpdateAsset.usecase';
import DeleteAssetUseCase from 'src/application/usecases/asset/DeleteAsset.usercase';
import GetAssetsUseCase from 'src/application/usecases/asset/GetAssets.usecase';
import MongooseUserEntity, {
  MongooseUserSchema,
} from '../database/repositories/mongoose/schemas/User.schema';
import MongooseUserRepositoryDatabase from '../database/repositories/mongoose/User.repository';
import ScoreProducerRabbitMQ from '../rabbitmq/score/Score.producer';
import RabbitModule from './RabbitMQ.module';
import MongooseScoreEntity, {
  MongooseScoreSchema,
} from '../database/repositories/mongoose/schemas/Score.schema';
import CalculateScoreUseCase from 'src/application/usecases/score/CalculateScore.usecase';
import MongooseScoreRepositoryDatabase from '../database/repositories/mongoose/Score.repository';
import MongooseDebtRepositoryDatabase from '../database/repositories/mongoose/Debt.repository';
import UpdateScoreUseCase from 'src/application/usecases/score/UpdateScore.usecase';
import MongooseDebtEntity, {
  MongooseDebtSchema,
} from '../database/repositories/mongoose/schemas/Debt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongooseAssetEntity.name,
        schema: MongooseAssetSchema,
      },
      {
        name: MongooseUserEntity.name,
        schema: MongooseUserSchema,
      },
      {
        name: MongooseScoreEntity.name,
        schema: MongooseScoreSchema,
      },
      {
        name: MongooseDebtEntity.name,
        schema: MongooseDebtSchema,
      },
    ]),
    RabbitModule,
  ],
  providers: [
    CreateAssetUseCase,
    GetByIdUseCase,
    GetAssetsUseCase,
    UpdateAssetUseCase,
    DeleteAssetUseCase,
    CalculateScoreUseCase,
    UpdateScoreUseCase,
    {
      provide: 'AssetRepository',
      useClass: MongooseAssetRepositoryDatabase,
    },
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
      provide: 'ScoreProducer',
      useClass: ScoreProducerRabbitMQ,
    },
  ],
  controllers: [AssetController],
})
export default class AssetModule {}
