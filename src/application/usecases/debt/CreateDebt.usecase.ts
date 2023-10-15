import { HttpStatus, Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import Debt from 'src/domain/debt/Debt';
import UserRepository from 'src/application/repository/UserRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';
import { Cache } from 'cache-manager';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';

type Input = {
  type: string;
  amount: number;
};

type Output = {
  debtId: string;
};

export default class CreateDebtUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('DebtRepository')
    readonly debtRepository: DebtRepository,
    @Inject('UserRepository')
    readonly userRepository: UserRepository,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    @Inject('ScoreProducer')
    readonly scoreProducer: ScoreProducer,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { amount, type } = input;
    const userId = String(await this.cacheManager.get('userId_cached'));
    const user = await this.userRepository.getOne({ userId: userId });
    if (!user)
      throw new DomainError(
        'User not found',
        `${SERVICE_NAME}/user-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const debt = Debt.create(userId, amount, type);
    await this.debtRepository.save(debt);
    await this.scoreProducer.updateScorePublish(userId);
    return {
      debtId: debt.debtId,
    };
  }
}
