import Asset from '../../../domain/asset/Asset';
import MongooseAssetEntity from '../repositories/mongoose/schemas/Asset.schema';

export default class MongooseAssetMapper {
  static toEntity(data: MongooseAssetEntity): Asset {
    return new Asset(
      data.assetId,
      data.userId,
      data.type,
      data.amount,
      data.createdAt,
      data.updatedAt,
    );
  }
}
