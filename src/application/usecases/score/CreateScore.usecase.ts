import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import Score from 'src/domain/score/Score';
import UserRepository from 'src/application/repository/UserRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  userId: string;
  score: number;
};
type Output = {
  scoreId: string;
};

export default class CreateScoreUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('ScoreRepository')
    readonly scoreRepository: ScoreRepository,
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
    const score = Score.create(input.userId, input.score);
    await this.scoreRepository.save(score);
    return {
      scoreId: score.scoreId,
    };
  }
}
