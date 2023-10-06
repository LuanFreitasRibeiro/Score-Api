import UserRepository from 'src/application/repository/UserRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { compareSync } from 'bcrypt';
import { Inject } from '@nestjs/common';

type Input = {
  email: string;
  password: string;
};
type Output = {
  userId: string;
  name: string;
  email: any;
  document: any;
  role: any;
};

export default class ValidateUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('UserRepository')
    readonly userRepository: UserRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getOne({ email: input.email });
    if (!user) return null;

    const isPasswordValid = compareSync(input.password, user.password);
    if (!isPasswordValid) return null;

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      document: user.document,
      role: user.role,
    };
  }
}
