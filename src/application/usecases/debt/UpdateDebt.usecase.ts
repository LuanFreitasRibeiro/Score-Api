import { HttpStatus, Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';

type Input = {
  debtId: string;
  type: string;
  amount: number;
};

type Output = Promise<void>;

export default class UpdateDebtUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('DebtRepository')
    readonly debtRepository: DebtRepository,
    @Inject('ScoreProducer')
    readonly scoreProducer: ScoreProducer,
  ) {}

  async execute(input: Input) {
    const { debtId, amount, type } = input;
    const debt = await this.debtRepository.getById(debtId);
    if (!debt)
      throw new DomainError(
        'Debt not found',
        `${SERVICE_NAME}/debt-not-found`,
        HttpStatus.NOT_FOUND,
      );
    await this.debtRepository.update(debtId, {
      amount: amount,
      type: type,
      updatedAt: new Date(),
    });
    await this.scoreProducer.updateScorePublish(debt.userId);
  }
}
