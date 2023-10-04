/* eslint-disable @typescript-eslint/no-unused-vars */
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import CreateScoreUseCase from 'src/application/usecases/score/CreateScore.usecase';
import Score from 'src/domain/score/Score';
import MongooseScoreRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/Score.repository';
import MongooseScoreEntity from 'src/infrastructure/database/repositories/mongoose/schemas/Score.schema';

describe('Integration Test - Create Score Use Case', () => {
  let useCase: CreateScoreUseCase;
  let scoreRepository: ScoreRepository;

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
      ],
    }).compile();

    useCase = moduleRef.get(CreateScoreUseCase);
    scoreRepository = moduleRef.get('ScoreRepository');
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(scoreRepository).toBeDefined();
  });

  it('Should create a Score', async () => {
    scoreRepository = {
      async save(score: Score): Promise<void> {},
      async getOne(email: any): Promise<any> {},
      async update(id: string, score: Score): Promise<any> {},
    };
    const createScoreUseCase = new CreateScoreUseCase(scoreRepository);
    const input = {
      userId: '',
      score: 0,
    };
    const output = await createScoreUseCase.execute(input);
    expect(output.scoreId).toBeDefined();
  });
});
