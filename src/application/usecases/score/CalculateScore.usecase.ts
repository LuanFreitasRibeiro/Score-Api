import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRespository.interface';
import AssetRepository from 'src/application/repository/AssetRespository.interface';

type Input = {
  userId: string;
};
type Output = {
  score: number;
};

export default class CalculateScoreUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('ScoreRepository')
    readonly scoreRepository: ScoreRepository,
    @Inject('DebtRepository')
    readonly debtRepository: DebtRepository,
    @Inject('AssetRepository')
    readonly assetRepository: AssetRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const assetsPoint = 0.61;
    const debtsPoint = 0.39;
    const debts = await this.debtRepository.get({ userId: input.userId });
    const assets = await this.assetRepository.get({ userId: input.userId });
    const creditScore =
      assets.reduce((total, asset) => total + asset.amount, 0) * assetsPoint -
      debts.reduce((total, debt) => total + debt.amount, 0) * debtsPoint;
    const limitedCreditScore = Math.max(0, Math.min(1000, creditScore));
    return {
      score: limitedCreditScore,
    };
  }
}
