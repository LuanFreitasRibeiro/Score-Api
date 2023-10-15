import { Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import Asset from 'src/domain/asset/Asset';

type Input = {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  order?: string;
  type?: string;
};

type Output = Promise<[Asset[], number]>;

export default class GetAssetsUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('AssetRepository')
    readonly assetRepository: AssetRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { pageNumber, pageSize, orderBy, order, type } = input;
    const searchParams = {
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize ?? 20,
      orderBy: orderBy ?? 'createdAt',
      order: order ?? 'desc',
      type: type ?? null,
    };

    return this.assetRepository.list(searchParams);
  }
}
