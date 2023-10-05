import { HttpStatus, Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import Debt from 'src/domain/debt/Debt';
import UserRepository from 'src/application/repository/UserRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  userId: string;
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
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getOne({ userId: input.userId });
    if (!user)
      throw new DomainError(
        'User not found',
        `${SERVICE_NAME}/user-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const debt = Debt.create(input.userId, input.amount, input.type);
    await this.debtRepository.save(debt);
    return {
      debtId: debt.debtId,
    };
  }
}
