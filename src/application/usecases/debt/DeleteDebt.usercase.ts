import { HttpStatus, Inject } from '@nestjs/common';
import UseCase from '../interfaces/UseCase.interface';
import DebtRepository from 'src/application/repository/DebtRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  debtId: string;
};

type Output = Promise<void>;

export default class DeleteDebtUseCase implements UseCase<Input, Output> {
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
    await this.debtRepository.delete(input.debtId);
  }
}
