import { InjectModel } from '@nestjs/mongoose';
import AssetRepository, {
  AssetSearchParams,
} from 'src/application/repository/AssetRespository.interface';
import Asset from '../../../../domain/asset/Asset';
import MongooseAssetEntity, {
  MongooseAssetDocument,
} from './schemas/Asset.schema';
import { Model, QueryOptions } from 'mongoose';
import MongooseAssetMapper from '../../mappers/MongooseAsset.mapper';

export default class MongooseAssetRepositoryDatabase
  implements AssetRepository
{
  constructor(
    @InjectModel(MongooseAssetEntity.name)
    public AssetModel: Model<MongooseAssetDocument>,
  ) {}

  async save(asset: Asset): Promise<void> {
    await this.AssetModel.create(asset);
  }

  async getById(id: string): Promise<Asset> {
    const asset = await this.AssetModel.findOne({ assetId: id });
    return asset == null ? null : MongooseAssetMapper.toEntity(asset);
  }

  async update(id: string, asset: Asset) {
    await this.AssetModel.findOneAndUpdate({ assetId: id }, asset, {
      new: true,
    });
  }

  async delete(id: string): Promise<void> {
    await this.AssetModel.findOneAndDelete({ assetId: id });
  }

  async get(
    filter: Record<string, any>,
    options?: QueryOptions,
  ): Promise<Asset[]> {
    const asset = await this.AssetModel.find(filter, {}, options);
    return asset == null ? null : asset.map(MongooseAssetMapper.toEntity);
  }

  async list(params: AssetSearchParams): Promise<[Asset[], number]> {
    const filter: Record<string, any> = {};
    if (params?.type) {
      filter.$or = [
        {
          type: {
            $regex: `${params?.type}.*`,
            $options: 'i',
          },
        },
      ];
    }
    const sortBy = {
      [params.orderBy]: params.order === 'asc' ? 1 : -1,
    };
    const count = await this.AssetModel.countDocuments(filter);
    const result = await this.AssetModel.find(
      filter,
      {},
      {
        limit: params.pageSize,
        skip: params.pageSize * (params.pageNumber - 1),
        sort: sortBy,
      },
    );
    return [result.map(MongooseAssetMapper.toEntity), count];
  }
}
