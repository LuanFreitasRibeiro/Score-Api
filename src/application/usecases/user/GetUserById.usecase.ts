import UserRepository from 'src/application/repository/UserRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  userId: string;
};
type Output = {
  userId: string;
  name: string;
  email: any;
  document: any;
};
export default class GetUserByIdUseCase implements UseCase<Input, Output> {
  constructor(
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

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      document: user.document,
    };
  }
}
