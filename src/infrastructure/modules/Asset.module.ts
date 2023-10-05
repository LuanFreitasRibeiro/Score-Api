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
    ]),
  ],
  providers: [
    CreateAssetUseCase,
    GetByIdUseCase,
    GetAssetsUseCase,
    UpdateAssetUseCase,
    DeleteAssetUseCase,
    {
      provide: 'AssetRepository',
      useClass: MongooseAssetRepositoryDatabase,
    },
    {
      provide: 'UserRepository',
      useClass: MongooseUserRepositoryDatabase,
    },
  ],
  controllers: [AssetController],
})
export default class AssetModule {}
