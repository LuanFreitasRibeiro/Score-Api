import { HttpStatus, Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from 'src/application/usecases/interfaces/UseCase.interface';
import Asset from '../../../domain/asset/Asset';
import UserRepository from 'src/application/repository/UserRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';
import { Cache } from 'cache-manager';

type Input = {
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
    @Inject('UserRepository')
    readonly userRepository: UserRepository,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async execute(input: Input): Promise<Output> {
    const userId = String(await this.cacheManager.get('userId_cached'));
    const user = await this.userRepository.getOne({ userId: userId });
    if (!user)
      throw new DomainError(
        'User not found',
        `${SERVICE_NAME}/user-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const asset = Asset.create(userId, input.type, input.amount);
    await this.assetRepository.save(asset);
    return {
      assetId: asset.assetId,
    };
  }
}
