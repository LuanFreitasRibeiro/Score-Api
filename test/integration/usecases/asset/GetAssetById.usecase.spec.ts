/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import MongooseAssetRepositoryDatabase from '../../../../src/infrastructure/database/repositories/mongoose/Asset.repository';
import { getModelToken } from '@nestjs/mongoose';
import MongooseAssetEntity from '../../../../src/infrastructure/database/repositories/mongoose/schemas/Asset.schema';
import AssetRepository, {
  AssetSearchParams,
} from '../../../../src/application/repository/AssetRepository.interface';
import GetByIdUseCase from '../../../../src/application/usecases/asset/GetAssetById.usecase';
import Asset from '../../../../src/domain/asset/Asset';

describe('Integration Test - Get Asset Usecase', () => {
  let useCase: GetByIdUseCase;
  let assetRepository: AssetRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetByIdUseCase,
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

    useCase = moduleRef.get(GetByIdUseCase);
    assetRepository = moduleRef.get('AssetRepository');
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(assetRepository).toBeDefined();
  });

  it('Should get a Asset', async () => {
    assetRepository = {
      async save(asset: any): Promise<void> {},
      async getById(id: string): Promise<any> {
        return Asset.create('', 'imovel', 15000);
      },
      async update(id: string, asset: any): Promise<void> {},
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
    const input = 'eb72dcdb-64a5-4d61-9772-aab1ebe9ec22';
    const getByIdUseCase = new GetByIdUseCase(assetRepository);
    const output = await getByIdUseCase.execute({ assetId: input });
    expect(output.assetId).toBeDefined();
  });

  it('Should throw an error: Asset not found', async () => {
    assetRepository = {
      async save(asset: any): Promise<void> {},
      async getById(id: string): Promise<any> {
        throw new Error('Asset not found');
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
    const input = 'eb72dcdb-64a5-4d61-9772-aab1ebe9ec22';
    const getByIdUseCase = new GetByIdUseCase(assetRepository);
    await expect(() =>
      getByIdUseCase.execute({ assetId: input }),
    ).rejects.toThrow(new Error('Asset not found'));
  });
});
