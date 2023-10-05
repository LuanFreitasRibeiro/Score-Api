import { HttpStatus, Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  debtId: string;
  type: string;
  amount: number;
};
// eslint-disable-next-line @typescript-eslint/ban-types
type Output = {};

export default class UpdateDebtUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('DebtRepository')
    readonly debtRepository: DebtRepository,
  ) {}
  async execute(input: Input) {
    const debt = await this.debtRepository.getById(input.debtId);
    if (!debt)
      throw new DomainError(
        'Debt not found',
        `${SERVICE_NAME}/debt-not-found`,
        HttpStatus.NOT_FOUND,
      );
    await this.debtRepository.update(input.debtId, {
      amount: input.amount,
      type: input.type,
      updatedAt: new Date(),
    });
  }
}
