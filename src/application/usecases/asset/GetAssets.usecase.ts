import { Inject } from '@nestjs/common';
import AssetRepository from 'src/application/repository/AssetRespository.interface';
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
    const searchParams = {
      pageNumber: input.pageNumber ?? 1,
      pageSize: input.pageSize ?? 20,
      orderBy: input.orderBy ?? 'createdAt',
      order: input.order ?? 'desc',
      type: input.type ?? null,
    };

    return this.assetRepository.list(searchParams);
  }
}
