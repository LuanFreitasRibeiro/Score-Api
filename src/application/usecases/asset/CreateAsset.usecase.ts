import { HttpStatus, Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from 'src/application/usecases/interfaces/UseCase.interface';
import Asset from '../../../domain/asset/Asset';
import UserRepository from 'src/application/repository/UserRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

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
    @Inject('UserRepository')
    readonly userRepository: UserRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getOne({ userId: input.userId });
    if (!user)
      throw new DomainError(
        'User not found',
        `${SERVICE_NAME}/user-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const asset = Asset.create(input.userId, input.type, input.amount);
    await this.assetRepository.save(asset);
    return {
      assetId: asset.assetId,
    };
  }
}
