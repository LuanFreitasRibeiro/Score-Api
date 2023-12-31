/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import MongooseAssetRepositoryDatabase from '../../../../src/infrastructure/database/repositories/mongoose/Asset.repository';
import { getModelToken } from '@nestjs/mongoose';
import MongooseAssetEntity from '../../../../src/infrastructure/database/repositories/mongoose/schemas/Asset.schema';
import AssetRepository, {
  AssetSearchParams,
} from '../../../../src/application/repository/AssetRepository.interface';
import Asset from '../../../../src/domain/asset/Asset';
import UpdateAssetUseCase from '../../../../src/application/usecases/asset/UpdateAsset.usecase';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import ScoreProducerRabbitMQ from 'src/infrastructure/rabbitmq/score/Score.producer';

describe('Integration Test - Update Asset Usecase', () => {
  let useCase: UpdateAssetUseCase;
  let assetRepository: AssetRepository;
  let scoreProducer: ScoreProducer;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateAssetUseCase,
        {
          provide: 'AssetRepository',
          useClass: MongooseAssetRepositoryDatabase,
        },
        {
          provide: getModelToken(MongooseAssetEntity.name),
          useValue: {},
        },
        {
          provide: AmqpConnection,
          useValue: {},
        },
        {
          provide: 'ScoreProducer',
          useClass: ScoreProducerRabbitMQ,
        },
      ],
    }).compile();

    useCase = moduleRef.get(UpdateAssetUseCase);
    assetRepository = moduleRef.get('AssetRepository');
    scoreProducer = moduleRef.get('ScoreProducer');
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(assetRepository).toBeDefined();
    expect(scoreProducer).toBeDefined();
  });

  it('Should update a Asset', async () => {
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
    const input = {
      assetId: 'c7837b8c-29f8-41c5-a1d1-b4d8a394edb9',
      type: 'imovel',
      amount: 15000,
    };
    scoreProducer = {
      async createScorePublish(userId: string): Promise<void> {},
      async updateScorePublish(userId: string): Promise<void> {},
    };
    const updateUseCase = new UpdateAssetUseCase(
      assetRepository,
      scoreProducer,
    );
    const output = await updateUseCase.execute(input);
    await expect(output).toBeUndefined();
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
    const input = {
      assetId: 'c7837b8c-29f8-41c5-a1d1-b4d8a394edb9',
      type: 'imovel',
      amount: 15000,
    };
    const updateUseCase = new UpdateAssetUseCase(
      assetRepository,
      scoreProducer,
    );
    await expect(() => updateUseCase.execute(input)).rejects.toThrow(
      new Error('Asset not found'),
    );
  });
});
