import { Inject } from '@nestjs/common';
import UseCase from '../interfaces/UseCase.interface';
import UserRepository from 'src/application/repository/UserRepository.interface';
import User from '../../../domain/user/User';
import { Role } from 'src/commons/enums/Role.enum';
import ScoreProducer from 'src/application/queue/ScoreProducer.interface';

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
    @Inject('ScoreProducer')
    private scoreProducer: ScoreProducer,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { email, name, password, document, role } = input;
    const user = User.create(email, name, password, document, role);
    await this.userRepository.save(user);
    await this.scoreProducer.createScorePublish(user.userId);
    return {
      userId: user.userId,
    };
  }
}
