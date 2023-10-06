import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import Score from 'src/domain/score/Score';
import UserRepository from 'src/application/repository/UserRepository.interface';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';
import { Cache } from 'cache-manager';

type Input = {
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
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}
  async execute(input: Input): Promise<Output> {
    const userId = String(await this.cacheManager.get('userId_cached'));
    const user = await this.userRepository.getOne({ userId: userId });
    if (!user)
      throw new DomainError(
        'User not found',
        `${SERVICE_NAME}/user-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const score = Score.create(userId, input.score);
    await this.scoreRepository.save(score);
    return {
      scoreId: score.scoreId,
    };
  }
}
