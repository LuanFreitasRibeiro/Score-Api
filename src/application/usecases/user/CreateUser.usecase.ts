import { Inject } from '@nestjs/common';
import UseCase from '../interfaces/UseCase.interface';
import UserRepository from 'src/application/repository/UserRepository.interface';
import User from '../../../domain/user/User';

type Input = {
  name: string;
  email: string;
  document: string;
  password: string;
};

type Output = {
  userId: string;
};

export default class CreateUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('UserRepository')
    readonly userRepository: UserRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const user = User.create(
      input.email,
      input.name,
      input.password,
      input.document,
    );
    return {
      userId: user.userId,
    };
  }
}
