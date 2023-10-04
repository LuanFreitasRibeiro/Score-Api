import { HttpStatus, Inject } from '@nestjs/common';
import UseCase from '../interfaces/UseCase.interface';
import DebtRepository from 'src/application/repository/DebtRespository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  debtId: string;
};
// eslint-disable-next-line @typescript-eslint/ban-types
type Output = {};

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
