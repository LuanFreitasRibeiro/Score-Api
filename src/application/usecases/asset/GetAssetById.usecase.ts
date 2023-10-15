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

    const { assetId, userId, type, amount, createdAt, updatedAt } = asset;
    return {
      assetId: assetId,
      userId: userId,
      type: type,
      amount: amount,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }
}
