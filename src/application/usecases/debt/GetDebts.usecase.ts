import { Inject } from '@nestjs/common';
import DebtRepository from 'src/application/repository/DebtRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import Debt from 'src/domain/debt/Debt';

type Input = {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  order?: string;
  type?: string;
};

type Output = Promise<[Debt[], number]>;

export default class GetDebtsUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('DebtRepository')
    readonly debtRepository: DebtRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const searchParams = {
      pageNumber: input.pageNumber ?? 1,
      pageSize: input.pageSize ?? 20,
      orderBy: input.orderBy ?? 'createdAt',
      order: input.order ?? 'desc',
      type: input.type ?? null,
    };

    return this.debtRepository.list(searchParams);
  }
}
