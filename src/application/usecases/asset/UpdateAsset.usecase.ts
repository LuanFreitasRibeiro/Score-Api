import { HttpStatus, Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { DomainError } from 'src/commons/errors/domain-error';
import { SERVICE_NAME } from 'src/commons/envs';

type Input = {
  assetId: string;
  type: string;
  amount: number;
};
// eslint-disable-next-line @typescript-eslint/ban-types
type Output = {};

export default class UpdateAssetUseCase implements UseCase<Input, Output> {
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
    await this.assetRepository.update(input.assetId, {
      amount: input.amount,
      type: input.type,
      updatedAt: new Date(),
    });
  }
}
