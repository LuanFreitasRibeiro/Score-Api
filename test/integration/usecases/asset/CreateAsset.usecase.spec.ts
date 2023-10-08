/* eslint-disable @typescript-eslint/no-unused-vars */

import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import AssetRepository, {
  AssetSearchParams,
} from 'src/application/repository/AssetRepository.interface';
import { Cache } from 'cache-manager';
import UserRepository from 'src/application/repository/UserRepository.interface';
import CreateAssetUseCase from 'src/application/usecases/asset/CreateAsset.usecase';
import Asset from 'src/domain/asset/Asset';
import User from 'src/domain/user/User';
import MongooseAssetRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/Asset.repository';
import MongooseUserRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/User.repository';
import MongooseAssetEntity from 'src/infrastructure/database/repositories/mongoose/schemas/Asset.schema';
import MongooseUserEntity from 'src/infrastructure/database/repositories/mongoose/schemas/User.schema';
import { Role } from 'src/commons/enums/Role.enum';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';
import ScoreProducerRabbitMQ from 'src/infrastructure/rabbitmq/score/Score.producer';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('Integration Test - Create Asset Usecase', () => {
  let useCase: CreateAssetUseCase;
  let assetRepository: AssetRepository;
  let userRepository: UserRepository;
  let cache: Cache;
  let scoreProducer: ScoreProducer;

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
        {
          provide: 'UserRepository',
          useClass: MongooseUserRepositoryDatabase,
        },
        {
          provide: getModelToken(MongooseUserEntity.name),
          useValue: {},
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
        {
          provide: 'ScoreProducer',
          useClass: ScoreProducerRabbitMQ,
        },
        {
          provide: AmqpConnection,
          useValue: {},
        },
      ],
    }).compile();

    useCase = moduleRef.get(CreateAssetUseCase);
    assetRepository = moduleRef.get('AssetRepository');
    userRepository = moduleRef.get('UserRepository');
    cache = moduleRef.get('CACHE_MANAGER');
    scoreProducer = moduleRef.get('ScoreProducer');
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(assetRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(cache).toBeDefined();
    expect(scoreProducer).toBeDefined();
  });

  it('Should create a Asset', async () => {
    const user = await User.create(
      'john.doe@gmail.com',
      'John Doe',
      'John@1234',
      '22668510040',
      Role.Customer,
    );
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
    userRepository = {
      async save(user: User): Promise<void> {},
      async getOne(email: any): Promise<any> {
        return user;
      },
      async update(id: string, user: any): Promise<any> {},
      async delete(id: string): Promise<void> {},
    };
    const input = {
      userId: 'e2fd1f7b-91e6-4724-a67f-398ef60fa816',
      type: 'imovel',
      amount: 15000,
    };
    scoreProducer = {
      async createScorePublish(userId: string): Promise<void> {},
      async updateScorePublish(userId: string): Promise<void> {},
    };
    const userId: string = user.userId;
    mockCacheManager.set('userId_cached', userId);
    mockCacheManager.get('userId_cached');
    const createUseCase = new CreateAssetUseCase(
      assetRepository,
      userRepository,
      cache,
      scoreProducer
    );
    const output = await createUseCase.execute(input);
    expect(output.assetId).toBeDefined();
  });
});
