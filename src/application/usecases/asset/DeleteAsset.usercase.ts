import { HttpStatus, Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  assetId: string;
};

type Output = Promise<void>;

export default class DeleteAssetUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('AssetRepository')
    readonly assetRepository: AssetRepository,
  ) {}
  async execute(input: Input) {
    const asset = await this.assetRepository.getById(input.assetId);
    if (!asset)
      throw new DomainError(
        'Asset not found',
        `${SERVICE_NAME}/asset-not-found`,
        HttpStatus.NOT_FOUND,
      );
    await this.assetRepository.delete(input.assetId);
  }
}
