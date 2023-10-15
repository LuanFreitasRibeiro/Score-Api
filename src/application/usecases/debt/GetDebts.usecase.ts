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
    const { pageNumber, pageSize, orderBy, order, type } = input;
    const searchParams = {
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize ?? 20,
      orderBy: orderBy ?? 'createdAt',
      order: order ?? 'desc',
      type: type ?? null,
    };

    return this.debtRepository.list(searchParams);
  }
}
