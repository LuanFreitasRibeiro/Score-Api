/* eslint-disable @typescript-eslint/no-unused-vars */
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UserRepository from 'src/application/repository/UserRepository.interface';
import CreateScoreUseCase from 'src/application/usecases/score/CreateScore.usecase';
import { Role } from 'src/commons/enums/Role.enum';
import Score from 'src/domain/score/Score';
import User from 'src/domain/user/User';
import MongooseScoreRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/Score.repository';
import MongooseUserRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/User.repository';
import MongooseScoreEntity from 'src/infrastructure/database/repositories/mongoose/schemas/Score.schema';
import MongooseUserEntity from 'src/infrastructure/database/repositories/mongoose/schemas/User.schema';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};


describe('Integration Test - Create Score Use Case', () => {
  let useCase: CreateScoreUseCase;
  let scoreRepository: ScoreRepository;
  let userRepository: UserRepository;
  let cache: Cache;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateScoreUseCase,
        {
          provide: 'ScoreRepository',
          useClass: MongooseScoreRepositoryDatabase,
        },
        {
          provide: getModelToken(MongooseScoreEntity.name),
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
      ],
    }).compile();

    useCase = moduleRef.get(CreateScoreUseCase);
    scoreRepository = moduleRef.get('ScoreRepository');
    userRepository = moduleRef.get('UserRepository');
    cache = moduleRef.get('CACHE_MANAGER');
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(scoreRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(cache).toBeDefined();
  });

  it('Should create a Score', async () => {
    const user = await User.create(
      'john.doe@gmail.com',
      'John Doe',
      'John@1234',
      '22668510040',
      Role.Customer,
    );
    scoreRepository = {
      async save(score: Score): Promise<void> {},
      async getOne(email: any): Promise<any> {},
      async update(id: string, score: Score): Promise<any> {},
    };
    userRepository = {
      async save(user: User): Promise<void> {},
      async getOne(email: any): Promise<any> {
        return user;
      },
      async update(id: string, user: any): Promise<any> {},
      async delete(id: string): Promise<void> {},
    };
    const userId: string = user.userId;
    mockCacheManager.set('userId_cached', userId);
    mockCacheManager.get('userId_cached');
    const createScoreUseCase = new CreateScoreUseCase(
      scoreRepository,
      userRepository,
      cache,
    );
    const input = {
      userId: '',
      score: 0,
    };
    const output = await createScoreUseCase.execute(input);
    expect(output.scoreId).toBeDefined();
  });
});
