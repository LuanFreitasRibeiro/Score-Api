import { Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from 'src/application/usecases/interfaces/UseCase.interface';
import Asset from '../../../domain/asset/Asset';

type Input = {
  userId: string;
  type: string;
  amount: number;
};

type Output = {
  assetId: string;
};

export default class CreateAssetUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('AssetRepository')
    readonly assetRepository: AssetRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const asset = Asset.create(input.userId, input.type, input.amount);
    await this.assetRepository.save(asset);
    return {
      assetId: asset.assetId,
    };
  }
}
