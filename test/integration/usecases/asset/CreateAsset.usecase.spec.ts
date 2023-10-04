/* eslint-disable @typescript-eslint/no-unused-vars */

import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import AssetRepository, {
  AssetSearchParams,
} from 'src/application/repository/AssetRespository.interface';
import CreateAssetUseCase from 'src/application/usecases/asset/CreateAsset.usecase';
import Asset from 'src/domain/asset/Asset';
import MongooseAssetRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/Asset.repository';
import MongooseAssetEntity from 'src/infrastructure/database/repositories/mongoose/schemas/Asset.schema';

describe('Integration Test - Create Asset Usecase', () => {
  let useCase: CreateAssetUseCase;
  let assetRepository: AssetRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateAssetUseCase,
        {
          provide: 'AssetRepository',
          useClass: MongooseAssetRepositoryDatabase,
        },
        {
          provide: getModelToken(MongooseAssetEntity.name),
          useValue: {},
        },
      ],
    }).compile();

    useCase = moduleRef.get(CreateAssetUseCase);
    assetRepository = moduleRef.get('AssetRepository');
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(assetRepository).toBeDefined();
  });

  it('Should create a Asset', async () => {
    assetRepository = {
      async save(asset: any): Promise<void> {},
      async getById(id: string): Promise<any> {
        return Asset.create('', 'imovel', 15000);
      },
      async update(asset: any): Promise<void> {},
      async delete(id: string): Promise<void> {},
      async list(params: AssetSearchParams): Promise<[Asset[], number]> {
        const assets = [];
        assets.push(Asset.create('', 'imovel', 15000));
        return [assets, 1];
      },
      async get(filter: any, options: any): Promise<any[]> {
        const assets = [];
        assets.push(Asset.create('', 'imovel', 15000));
        return [assets, 1];
      },
    };
    const input = {
      userId: 'e2fd1f7b-91e6-4724-a67f-398ef60fa816',
      type: 'imovel',
      amount: 15000,
    };
    const createUseCase = new CreateAssetUseCase(assetRepository);
    const output = await createUseCase.execute(input);
    expect(output.assetId).toBeDefined();
  });
});
