import ScoreRepository from 'src/application/repository/ScoreRepository.interface';
import UseCase from '../interfaces/UseCase.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { SERVICE_NAME } from 'src/commons/envs';
import { DomainError } from 'src/commons/errors/domain-error';

type Input = {
  scoreId: string;
};
type Output = {
  scoreId: string;
  userId: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

export default class GetScoreByIdUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject('ScoreRepository') readonly scoreRepository: ScoreRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const score = await this.scoreRepository.getOne({ scoreId: input.scoreId });
    if (!score)
      throw new DomainError(
        'Score not found',
        `${SERVICE_NAME}/score-not-found`,
        HttpStatus.NOT_FOUND,
      );
    return {
      scoreId: score.scoreId,
      score: score.score,
      userId: score.userId,
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
    };
  }
}
