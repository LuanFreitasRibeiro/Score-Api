import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  userId: string;
  score: number;
};
type Output = Promise<void>;
export default class UpdateScoreUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('ScoreRepository')
    readonly scoreRepository: ScoreRepository,
  ) {}

  async execute(input: Input): Output {
    const score = await this.scoreRepository.getOne({ userId: input.userId });
    if (!score)
      throw new DomainError(
        'There is no score for this user',
        `${SERVICE_NAME}/score-not-found`,
        HttpStatus.NOT_FOUND,
      );
    await this.scoreRepository.update(input.userId, {
      score: input.score,
      updatedAt: new Date(),
    });
  }
}
