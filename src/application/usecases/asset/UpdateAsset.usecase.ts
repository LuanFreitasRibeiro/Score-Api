import { HttpStatus, Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { DomainError } from 'src/commons/errors/domain-error';
import { SERVICE_NAME } from 'src/commons/envs';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';

type Input = {
  assetId: string;
  type: string;
  amount: number;
};

type Output = Promise<void>;

export default class UpdateAssetUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('AssetRepository')
    readonly assetRepository: AssetRepository,
    @Inject('ScoreProducer')
    readonly scoreProducer: ScoreProducer,
  ) {}
  async execute(input: Input) {
    const asset = await this.assetRepository.getById(input.assetId);
    if (!asset)
      throw new DomainError(
        'Asset not found',
        `${SERVICE_NAME}/asset-not-found`,
        HttpStatus.NOT_FOUND,
      );
    await this.assetRepository.update(input.assetId, {
      amount: input.amount,
      type: input.type,
      updatedAt: new Date(),
    });
    await this.scoreProducer.updateScorePublish(asset.userId);
  }
}
