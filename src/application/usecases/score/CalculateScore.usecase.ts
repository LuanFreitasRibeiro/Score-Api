import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRepository.interface';
import AssetRepository from 'src/application/repository/AssetRepository.interface';
import { DomainError } from 'src/commons/errors/domain-error';
import { SERVICE_NAME } from 'src/commons/envs';

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
    const { userId } = input;
    const debts = await this.debtRepository.get({ userId: userId });
    if (!debts)
      throw new DomainError(
        'Debts not found',
        `${SERVICE_NAME}/debt-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const assets = await this.assetRepository.get({ userId: userId });
    if (!assets)
      throw new DomainError(
        'Assets not found',
        `${SERVICE_NAME}/asset-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const assetsPoint = 0.61;
    const debtsPoint = 0.39;
    const creditScore =
      assets.reduce((total, asset) => total + asset.amount, 0) * assetsPoint -
      debts.reduce((total, debt) => total + debt.amount, 0) * debtsPoint;
    const limitedCreditScore = Math.max(0, Math.min(1000, creditScore));
    return {
      score: limitedCreditScore,
    };
  }
}
