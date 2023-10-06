import { Inject } from '@nestjs/common';
import UseCase from '../interfaces/UseCase.interface';
import UserRepository from 'src/application/repository/UserRepository.interface';
import User from '../../../domain/user/User';
import { Role } from 'src/commons/enums/Role.enum';

type Input = {
  name: string;
  email: string;
  document: string;
  password: string;
  role: Role;
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
      input.role,
    );
    await this.userRepository.save(user);
    return {
      userId: user.userId,
    };
  }
}
