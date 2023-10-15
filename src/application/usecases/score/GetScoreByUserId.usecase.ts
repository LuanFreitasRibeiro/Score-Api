import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  userId: string;
};

type Output = {
  scoreId: string;
  userId: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

export default class GetScoreByUserIdUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('ScoreRepository') readonly scoreRepository: ScoreRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const score = await this.scoreRepository.getOne({ scoreId: input.userId });
    if (!score)
      throw new DomainError(
        'Score not found',
        `${SERVICE_NAME}/score-not-found`,
        HttpStatus.NOT_FOUND,
      );
    const { scoreId, userId, createdAt, updatedAt } = score;
    return {
      scoreId: scoreId,
      score: score.score,
      userId: userId,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }
}
