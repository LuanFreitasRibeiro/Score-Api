import { HttpStatus, Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRespository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  debtId: string;
};

type Output = {
  debtId: string;
  userId: string;
  type: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};
export default class GetByIdUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('DebtRepository')
    readonly debtRepository: DebtRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const debt = await this.debtRepository.getById(input.debtId);
    if (!debt)
      throw new DomainError(
        'Debt not found',
        `${SERVICE_NAME}/debt-not-found`,
        HttpStatus.NOT_FOUND,
      );
    return {
      debtId: debt.debtId,
      userId: debt.userId,
      type: debt.type,
      amount: debt.amount,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
    };
  }
}
