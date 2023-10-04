import { Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRespository.interface';
import UseCase from '../interfaces/UseCase.interface';
import Debt from 'src/domain/debt/Debt';

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
  ) {}

  async execute(input: Input): Promise<Output> {
    const debt = Debt.create(input.userId, input.amount, input.type);
    await this.debtRepository.save(debt);
    return {
      debtId: debt.debtId,
    };
  }
}
