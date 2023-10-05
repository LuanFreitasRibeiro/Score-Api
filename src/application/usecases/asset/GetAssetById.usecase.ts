import { HttpStatus, Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { DomainError } from 'src/commons/errors/domain-error';
import { SERVICE_NAME } from 'src/commons/envs';

type Input = {
  assetId: string;
};

type Output = {
  assetId: string;
  userId: string;
  type: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};
export default class GetByIdUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('AssetRepository')
    readonly assetRepository: AssetRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const asset = await this.assetRepository.getById(input.assetId);
    if (!asset)
      throw new DomainError(
        'Asset not found',
        `${SERVICE_NAME}/asset-not-found`,
        HttpStatus.NOT_FOUND,
      );
    return {
      assetId: asset.assetId,
      userId: asset.userId,
      type: asset.type,
      amount: asset.amount,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  }
}
