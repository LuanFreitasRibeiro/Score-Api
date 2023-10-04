import UserRepository from 'src/application/repository/UserRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  email: string;
};
type Output = {
  userId: string;
  name: string;
  email: any;
  document: any;
};

export default class GetUserByEmailUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getOne({ email: input.email });
    if (!user)
      throw new DomainError(
        'User not found',
        `${SERVICE_NAME}/score-not-found`,
        HttpStatus.NOT_FOUND,
      );
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      document: user.document,
    };
  }
}
