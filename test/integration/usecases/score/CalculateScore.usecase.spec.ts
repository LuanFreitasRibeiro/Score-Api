/* eslint-disable @typescript-eslint/no-unused-vars */
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import AssetRepository, {
  AssetSearchParams,
} from 'src/application/repository/AssetRepository.interface';
import DebtRepository, {
  DebtSearchParams,
} from 'src/application/repository/DebtRepository.interface';
import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import CalculateScoreUseCase from 'src/application/usecases/score/CalculateScore.usecase';
import Asset from 'src/domain/asset/Asset';
import Debt from 'src/domain/debt/Debt';
import Score from 'src/domain/score/Score';
import MongooseAssetRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/Asset.repository';
import MongooseDebtRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/Debt.repository';
import MongooseScoreRepositoryDatabase from 'src/infrastructure/database/repositories/mongoose/Score.repository';
import MongooseAssetEntity from 'src/infrastructure/database/repositories/mongoose/schemas/Asset.schema';
import MongooseDebtEntity from 'src/infrastructure/database/repositories/mongoose/schemas/Debt.schema';
import MongooseScoreEntity from 'src/infrastructure/database/repositories/mongoose/schemas/Score.schema';

describe('Integration Test - Calculate Score Use Case', () => {
  let useCase: CalculateScoreUseCase;
  let scoreRepository: ScoreRepository;
  let debtRepository: DebtRepository;
  let assetRepository: AssetRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CalculateScoreUseCase,
        {
          provide: 'ScoreRepository',
          useClass: MongooseScoreRepositoryDatabase,
        },
        {
          provide: getModelToken(MongooseScoreEntity.name),
          useValue: {},
        },
        {
          provide: 'DebtRepository',
          useClass: MongooseDebtRepositoryDatabase,
        },
        {
          provide: getModelToken(MongooseDebtEntity.name),
          useValue: {},
        },
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

    useCase = moduleRef.get(CalculateScoreUseCase);
    scoreRepository = moduleRef.get('ScoreRepository');
    debtRepository = moduleRef.get('DebtRepository');
    assetRepository = moduleRef.get('AssetRepository');
  });

  it('Should be defined', () => {
    expect(useCase).toBeDefined();
    expect(scoreRepository).toBeDefined();
    expect(debtRepository).toBeDefined();
    expect(assetRepository).toBeDefined();
  });

  it('Should calculate a Score', async () => {
    scoreRepository = {
      async save(score: Score): Promise<void> {},
      async getOne(email: any): Promise<any> {},
      async update(id: string, score: Score): Promise<any> {},
    };
    assetRepository = {
      async save(asset: any): Promise<void> {},
      async getById(id: string): Promise<any> {
        return Asset.create('', 'imovel', 15000);
      },
      async update(asset: any): Promise<void> {},
      async delete(id: string): Promise<void> {},
      async list(params: AssetSearchParams): Promise<[Asset[], number]> {
        const assets = [];
        return [assets, 1];
      },
      async get(filter: any, options: any): Promise<any[]> {
        const assets = [];
        assets.push(Asset.create('', 'imovel', 1000));
        assets.push(Asset.create('', 'imovel', 400));
        return assets;
      },
    };
    debtRepository = {
      async save(score: Debt): Promise<void> {},
      async getById(id: string): Promise<Debt> {
        return Debt.create('', 100, 'automovel');
      },
      async get(filter: any, options: any): Promise<any[]> {
        const debts = [];
        debts.push(Debt.create('', 500, 'automovel'));
        debts.push(Debt.create('', 200, 'automovel'));
        return debts;
      },
      async update(asset: any): Promise<void> {},
      async delete(id: string): Promise<void> {},
      async list(params: DebtSearchParams): Promise<[Debt[], number]> {
        const debts = [];
        return [debts, 1];
      },
    };
    const calculateUseCase = new CalculateScoreUseCase(
      scoreRepository,
      debtRepository,
      assetRepository,
    );
    const input = { userId: '' };
    const output = await calculateUseCase.execute(input);
    expect(output.score).toBeDefined();
    expect(output.score).toBe(581);
  });
});
