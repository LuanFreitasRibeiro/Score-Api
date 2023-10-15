import { HttpStatus, Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from 'src/application/usecases/interfaces/UseCase.interface';
import Asset from '../../../domain/asset/Asset';
import UserRepository from 'src/application/repository/UserRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';
import { Cache } from 'cache-manager';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';

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
    @Inject('ScoreProducer')
    readonly scoreProducer: ScoreProducer,
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
    const { type, amount } = input;
    const asset = Asset.create(userId, type, amount);
    await this.assetRepository.save(asset);
    await this.scoreProducer.updateScorePublish(userId);
    return {
      assetId: asset.assetId,
    };
  }
}
