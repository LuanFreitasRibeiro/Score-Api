import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import Score from 'src/domain/score/Score';
import UserRepository from 'src/application/repository/UserRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';
import { Cache } from 'cache-manager';

type Input = {
  userId: string;
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
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}
  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getOne({ userId: input.userId });
    if (!user)
      throw new DomainError(
        'User not found',
        `${SERVICE_NAME}/user-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const scoreValue = 0;
    const score = Score.create(input.userId, scoreValue);
    await this.scoreRepository.save(score);
    return {
      scoreId: score.scoreId,
    };
  }
}
